import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { DISTRICTS, calcScore } from './teams.js'
import { makeGrassTex, makeRoadTex, makePaveTex, makeWaterTex, makeGlassTex } from './textures.js'

export default function CityScene({ teams, currentUserId, onSelect, tod, onFps }) {
  const mountRef = useRef(null)
  const sceneRef = useRef({})

  /* ── Time-of-day updater ── */
  const applyTod = useCallback((mode) => {
    const r = sceneRef.current; if (!r.scene) return
    const P = {
      day:  {sT:[0.64,0.82,0.97],sB:[0.20,0.46,0.73],fog:0xb8d4ec,fD:0.0015,sI:4.2,sC:0xfff5e0,aI:1.8,aC:0xfff8f2,hT:0x8dcff2,hG:0x4a7a1e,hI:0.9,sp:[330,440,210],sv:true},
      dusk: {sT:[0.95,0.55,0.25],sB:[0.18,0.08,0.30],fog:0xc86838,fD:0.0020,sI:2.2,sC:0xff7820,aI:0.85,aC:0xff8035,hT:0xff6020,hG:0x1a0a00,hI:0.5,sp:[460,88,280],sv:true},
      night:{sT:[0.02,0.04,0.12],sB:[0.01,0.02,0.08],fog:0x020610,fD:0.0028,sI:0.12,sC:0x101880,aI:0.22,aC:0x06101a,hT:0x060e1a,hG:0x020804,hI:0.15,sp:[330,440,210],sv:false},
    }
    const p = P[mode]
    if (r.skyColors) {
      const pos = r.skyGeo.getAttribute('position'), col = r.skyColors
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i)/920, t = Math.max(0, Math.min(1, (y+0.3)/1.3))
        col.setXYZ(i, THREE.MathUtils.lerp(p.sB[0],p.sT[0],t), THREE.MathUtils.lerp(p.sB[1],p.sT[1],t), THREE.MathUtils.lerp(p.sB[2],p.sT[2],t))
      }
      r.skyColors.needsUpdate = true
    }
    if (r.fog)   { r.fog.color.setHex(p.fog); r.fog.density = p.fD }
    if (r.sun)   { r.sun.intensity = p.sI; r.sun.color.setHex(p.sC); r.sun.position.set(...p.sp) }
    if (r.amb)   { r.amb.intensity = p.aI; r.amb.color.setHex(p.aC) }
    if (r.hemi)  { r.hemi.intensity = p.hI; r.hemi.color.setHex(p.hT); r.hemi.groundColor.setHex(p.hG) }
    if (r.sunSph) r.sunSph.visible = p.sv
    if (r.glassMats) r.glassMats.forEach(m => { m.emissiveIntensity = mode === 'night' ? 0.30 : 0 })
    if (r.lampLights) r.lampLights.forEach(l => { l.intensity = mode === 'night' ? 2.8 : mode === 'dusk' ? 0.9 : 0 })
  }, [])

  useEffect(() => { applyTod(tod) }, [tod, applyTod])

  /* ── Build scene ── */
  useEffect(() => {
    const mount = mountRef.current; if (!mount) return
    let VW = mount.clientWidth, VH = mount.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(VW, VH)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const fog = new THREE.FogExp2(0xc86838, 0.0020); scene.fog = fog

    /* FREE-FLY CAMERA */
    const cam = new THREE.PerspectiveCamera(60, VW/VH, 0.5, 2000)
    cam.position.set(0, 200, 260); cam.rotation.order = 'YXZ'
    let yaw = -0.1, pitch = -0.55
    cam.rotation.y = yaw; cam.rotation.x = pitch

    const keys = {}
    const kd = e => { keys[e.code] = true; if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) e.preventDefault() }
    const ku = e => { keys[e.code] = false }
    window.addEventListener('keydown', kd, { passive: false })
    window.addEventListener('keyup', ku)

    let drag = false, lx = 0, ly = 0
    const md = e => { if (e.button !== 0) return; drag=true; lx=e.clientX; ly=e.clientY; mount.style.cursor='grabbing' }
    const mu = () => { drag=false; mount.style.cursor='crosshair' }
    const mm = e => {
      if (!drag) return
      yaw -= (e.clientX-lx)*0.0025
      pitch = Math.max(-1.52, Math.min(0.25, pitch-(e.clientY-ly)*0.0025))
      lx = e.clientX; ly = e.clientY
      cam.rotation.y = yaw; cam.rotation.x = pitch
    }
    const mw = e => {
      const s = e.deltaY * 0.18
      cam.position.x += Math.sin(yaw)*Math.cos(pitch)*(-s)
      cam.position.y += Math.sin(pitch)*s
      cam.position.z += Math.cos(yaw)*Math.cos(pitch)*(-s)
    }
    mount.addEventListener('mousedown', md)
    window.addEventListener('mouseup', mu)
    window.addEventListener('mousemove', mm)
    mount.addEventListener('wheel', mw, { passive: true })

    /* raycasting */
    const raycaster = new THREE.Raycaster()
    const mp2 = new THREE.Vector2()
    const clickables = []
    const onClick = e => {
      if (Math.abs(e.clientX-lx)>5 || Math.abs(e.clientY-ly)>5) return
      const rect = mount.getBoundingClientRect()
      mp2.x = ((e.clientX-rect.left)/rect.width)*2-1
      mp2.y = -((e.clientY-rect.top)/rect.height)*2+1
      raycaster.setFromCamera(mp2, cam)
      const hits = raycaster.intersectObjects(clickables, true)
      if (hits.length) {
        let o = hits[0].object
        while (o && !o.userData.team) o = o.parent
        if (o?.userData.team) { onSelect(o.userData.team); return }
      }
      onSelect(null)
    }
    mount.addEventListener('click', onClick)

    /* textures */
    const grassTex = makeGrassTex()
    const roadTex  = makeRoadTex()
    const paveTex  = makePaveTex()

    /* ── SKY ── */
    const skyGeo = new THREE.SphereGeometry(920, 28, 18)
    const skyArr = []
    const skyPos = skyGeo.getAttribute('position')
    for (let i = 0; i < skyPos.count; i++) {
      const y = skyPos.getY(i)/920, t = Math.max(0, Math.min(1, (y+0.3)/1.3))
      skyArr.push(THREE.MathUtils.lerp(0.18,0.95,t), THREE.MathUtils.lerp(0.08,0.55,t), THREE.MathUtils.lerp(0.30,0.25,t))
    }
    const skyColors = new THREE.Float32BufferAttribute(skyArr, 3)
    skyGeo.setAttribute('color', skyColors)
    scene.add(new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({ vertexColors:true, side:THREE.BackSide, fog:false })))

    const sunSph = new THREE.Mesh(new THREE.SphereGeometry(10,14,12), new THREE.MeshBasicMaterial({ color:0xfff5c0, fog:false }))
    sunSph.position.set(460, 88, 280); scene.add(sunSph)
    const haloM = new THREE.Mesh(new THREE.CircleGeometry(28, 20), new THREE.MeshBasicMaterial({ color:0xffc860, transparent:true, opacity:0.18, side:THREE.DoubleSide, fog:false, depthWrite:false }))
    haloM.position.copy(sunSph.position); scene.add(haloM)

    /* clouds */
    const clouds = []
    const cloudMat = new THREE.MeshLambertMaterial({ color:0xf0f2f6, transparent:true, opacity:0.90, fog:false })
    ;[[-140,106,-238,22,.014],[118,118,-298,26,.010],[-278,96,-178,16,.017],[226,112,-258,23,.011],[58,128,-318,28,.009],[-355,90,-146,15,.018],[338,102,-196,19,.012],[-106,136,-375,30,.008],[396,108,-248,22,.010],[-200,115,-420,24,.013]].forEach(([x,y,z,s,sp]) => {
      const g = new THREE.Group()
      [[0,0,0,s],[s*.82,s*.18,0,s*.70],[-s*.70,s*.10,0,s*.62],[s*.36,s*.34,0,s*.50],[0,s*.50,0,s*.46]].forEach(([cx,cy,cz,r]) => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(r,7,5), cloudMat)
        m.position.set(cx,cy,cz); g.add(m)
      })
      g.position.set(x,y,z); g.userData.sp = sp; scene.add(g); clouds.push(g)
    })

    /* ── LIGHTS ── */
    const amb = new THREE.AmbientLight(0xff8035, 0.85); scene.add(amb)
    const sun = new THREE.DirectionalLight(0xff7820, 2.2)
    sun.position.set(460,88,280); sun.castShadow = true
    sun.shadow.mapSize.set(2048,2048)
    const SC=280; sun.shadow.camera.left=-SC; sun.shadow.camera.right=SC; sun.shadow.camera.top=SC; sun.shadow.camera.bottom=-SC; sun.shadow.camera.far=950; sun.shadow.bias=-0.0004
    scene.add(sun)
    const fill = new THREE.DirectionalLight(0xa0c8e8, 0.65); fill.position.set(-210,75,-285); scene.add(fill)
    const hemi = new THREE.HemisphereLight(0xff6020, 0x1a0a00, 0.5); scene.add(hemi)
    Object.values(DISTRICTS).forEach(d => { const pl = new THREE.PointLight(d.col,1.8,115); pl.position.set(d.cx,52,d.cz); scene.add(pl) })

    /* ── GROUND ── */
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(950,950), new THREE.MeshLambertMaterial({ map:grassTex }))
    ground.rotation.x = -Math.PI/2; ground.receiveShadow = true; scene.add(ground)

    /* ══ CENTRAL ROUNDABOUT (Lisbon style) ══ */
    const ROAD_W = 24, PLAZA_R = 78
    const roadMat = new THREE.MeshLambertMaterial({ map:roadTex })
    const pavMat  = new THREE.MeshLambertMaterial({ map:paveTex })
    const swMat   = new THREE.MeshLambertMaterial({ map:paveTex })

    // circular ring road
    const rrPts = []
    for (let i=0; i<=180; i++) { const a=i/180*Math.PI*2; rrPts.push(new THREE.Vector3(Math.cos(a)*(PLAZA_R+ROAD_W*.5),0,Math.sin(a)*(PLAZA_R+ROAD_W*.5))) }
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rrPts,true),240,ROAD_W*.5,10,true), roadMat))

    // terracotta walkway belt
    const walkBelt = new THREE.Mesh(new THREE.RingGeometry(PLAZA_R-22, PLAZA_R-2, 80), new THREE.MeshLambertMaterial({ color:0xb86040, map:paveTex }))
    walkBelt.rotation.x = -Math.PI/2; walkBelt.position.y = 0.06; scene.add(walkBelt)

    // green lawn
    const lawn = new THREE.Mesh(new THREE.CircleGeometry(PLAZA_R-22,72), new THREE.MeshLambertMaterial({ color:0x3e7f1a }))
    lawn.rotation.x=-Math.PI/2; lawn.position.y=0.05; scene.add(lawn)
    const innerLawn = new THREE.Mesh(new THREE.CircleGeometry(PLAZA_R-38,64), new THREE.MeshLambertMaterial({ color:0x468c1e }))
    innerLawn.rotation.x=-Math.PI/2; innerLawn.position.y=0.055; scene.add(innerLawn)
    const cDisc = new THREE.Mesh(new THREE.CircleGeometry(15,48), pavMat)
    cDisc.rotation.x=-Math.PI/2; cDisc.position.y=0.07; scene.add(cDisc)

    // 12 radial spokes
    const spkMat = new THREE.MeshLambertMaterial({ color:0xc8b890, transparent:true, opacity:0.88 })
    const spkLen = PLAZA_R-38
    for (let i=0; i<12; i++) {
      const a = i/12*Math.PI*2
      const sp = new THREE.Mesh(new THREE.PlaneGeometry(3.6, spkLen), spkMat)
      sp.rotation.x=-Math.PI/2; sp.rotation.z=-a
      sp.position.set(Math.cos(a)*(15+spkLen/2), 0.065, Math.sin(a)*(15+spkLen/2))
      scene.add(sp)
    }

    // 4 radial roads
    [[1,0],[0,1],[-1,0],[0,-1]].forEach(([dx,dz]) => {
      const angle = Math.atan2(dz,dx)
      const rl = new THREE.Mesh(new THREE.PlaneGeometry(ROAD_W, 750), roadMat)
      rl.rotation.x=-Math.PI/2; rl.rotation.z=-angle+Math.PI/2
      rl.position.set(dx*(PLAZA_R+ROAD_W/2+375), 0.04, dz*(PLAZA_R+ROAD_W/2+375))
      rl.receiveShadow=true; scene.add(rl)
      // sidewalks
      ;[-1,1].forEach(side => {
        const sw = new THREE.Mesh(new THREE.PlaneGeometry(10, 750), swMat)
        sw.rotation.x=-Math.PI/2; sw.rotation.z=-angle+Math.PI/2
        sw.position.set(dx*(PLAZA_R+ROAD_W/2+375)+dz*side*(ROAD_W/2+5), 0.038, dz*(PLAZA_R+ROAD_W/2+375)+dx*side*(ROAD_W/2+5))
        scene.add(sw)
        const kb = new THREE.Mesh(new THREE.BoxGeometry(0.4,0.25,750), new THREE.MeshLambertMaterial({ color:0xd0c8b4 }))
        kb.rotation.y = angle
        kb.position.set(dx*(PLAZA_R+ROAD_W/2+375)+dz*side*(ROAD_W/2+0.2), 0.12, dz*(PLAZA_R+ROAD_W/2+375)+dx*side*(ROAD_W/2+0.2))
        scene.add(kb)
      })
    })

    // Tiered fountain
    const stoneMat = new THREE.MeshStandardMaterial({ color:0xddd5c2, roughness:0.28, metalness:0.42 })
    const wMat    = new THREE.MeshStandardMaterial({ color:0x4ec8d8, emissive:0x1a7085, emissiveIntensity:0.55, roughness:0.02, metalness:0.92 })
    const addM = (geo,mat,x,y,z,cs=false) => { const m=new THREE.Mesh(geo,mat); m.position.set(x,y,z); if(cs)m.castShadow=true; scene.add(m); return m }
    addM(new THREE.CylinderGeometry(12,13,1.3,44), stoneMat, 0,0.65,0, true)
    const fw0 = addM(new THREE.CircleGeometry(11.4,44), wMat, 0,1.32,0); fw0.rotation.x=-Math.PI/2
    addM(new THREE.CylinderGeometry(7.5,8,0.9,36), stoneMat, 0,2.15,0)
    const fw1 = addM(new THREE.CircleGeometry(7.0,36), wMat, 0,2.65,0); fw1.rotation.x=-Math.PI/2
    addM(new THREE.CylinderGeometry(3.8,4.4,0.7,28), stoneMat, 0,3.35,0)
    const fw2 = addM(new THREE.CircleGeometry(3.4,28), wMat, 0,3.78,0); fw2.rotation.x=-Math.PI/2
    addM(new THREE.CylinderGeometry(0.65,0.85,5.5,12), stoneMat, 0,7.0,0, true)
    addM(new THREE.SphereGeometry(1.3,12,10), new THREE.MeshStandardMaterial({ color:0xdceaf6, roughness:0.12, metalness:0.80 }), 0,10.2,0)
    const fL = new THREE.PointLight(0x4ec8d8, 4.5, 55); fL.position.set(0,6,0); scene.add(fL)

    /* ══ INSTANCED TREES ══ */
    const MAX_T = 500
    const trunkI = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.22,0.38,4.5,7), new THREE.MeshLambertMaterial({ color:0x4a3018 }), MAX_T)
    const leafI  = new THREE.InstancedMesh(new THREE.SphereGeometry(3.0,8,6),  new THREE.MeshLambertMaterial({ color:0x337016 }), MAX_T)
    trunkI.castShadow=false; leafI.castShadow=false
    scene.add(trunkI); scene.add(leafI)
    const dm = new THREE.Object3D(); let tI = 0

    const addTree = (x,z,s=1) => {
      if (tI >= MAX_T) return
      const sc2 = s*(0.70+Math.random()*.58), ry=Math.random()*Math.PI*2
      dm.position.set(x,2.25*sc2,z); dm.scale.setScalar(sc2); dm.rotation.y=ry; dm.updateMatrix(); trunkI.setMatrixAt(tI,dm.matrix)
      dm.position.set(x,4.5*sc2+3.0*sc2*.5,z); dm.scale.setScalar(sc2*(0.80+Math.random()*.50)); dm.rotation.y=ry; dm.updateMatrix(); leafI.setMatrixAt(tI,dm.matrix)
      tI++
    }

    // plaza rings (3 dense rings like image 1)
    for (let i=0; i<100; i++) { const a=i/100*Math.PI*2,r=PLAZA_R-4+(i%3)*2.4; addTree(Math.cos(a)*r, Math.sin(a)*r, 1.05+Math.random()*.3) }
    for (let i=0; i<72;  i++) { const a=i/72*Math.PI*2, r=PLAZA_R-12+(i%2)*2.0; addTree(Math.cos(a)*r, Math.sin(a)*r, 0.92+Math.random()*.28) }
    for (let i=0; i<52;  i++) { const a=i/52*Math.PI*2, r=PLAZA_R-20;           addTree(Math.cos(a)*r, Math.sin(a)*r, 0.84+Math.random()*.22) }
    // boulevard trees
    ;[[1,0],[0,1],[-1,0],[0,-1]].forEach(([dx,dz]) => {
      for (let d=120; d<=380; d+=18) {
        addTree(dx*(PLAZA_R+ROAD_W/2+d)+dz*(ROAD_W/2+7), dz*(PLAZA_R+ROAD_W/2+d)+dx*(ROAD_W/2+7), 0.82+Math.random()*.35)
        addTree(dx*(PLAZA_R+ROAD_W/2+d)-dz*(ROAD_W/2+7), dz*(PLAZA_R+ROAD_W/2+d)-dx*(ROAD_W/2+7), 0.82+Math.random()*.35)
      }
    })
    Object.values(DISTRICTS).forEach(d => {
      for (let i=0; i<22; i++) { const a=i/22*Math.PI*2,r=58+(i%4)*9; addTree(d.cx+Math.cos(a)*r, d.cz+Math.sin(a)*r, 0.88+Math.random()*.55) }
    })
    for (; tI<MAX_T; tI++) {
      const a=Math.random()*Math.PI*2, r=190+Math.random()*150
      dm.position.set(Math.cos(a)*r,0,Math.sin(a)*r); dm.scale.setScalar(0.25+Math.random()*1.1); dm.rotation.y=Math.random()*Math.PI*2; dm.updateMatrix()
      trunkI.setMatrixAt(tI,dm.matrix); leafI.setMatrixAt(tI,dm.matrix)
    }
    trunkI.instanceMatrix.needsUpdate=true; leafI.instanceMatrix.needsUpdate=true

    /* ══ BUILDINGS ══ */
    // Group teams by district
    const byDist = {}
    teams.forEach(t => { if (!byDist[t.district]) byDist[t.district]=[]; byDist[t.district].push(t) })

    const bGroups = [], glassMats = []
    const podMat   = new THREE.MeshStandardMaterial({ color:0xccc4b2, roughness:0.55, metalness:0.18 })
    const metalMat = new THREE.MeshStandardMaterial({ color:0xb8c8d4, metalness:0.97, roughness:0.05 })

    Object.entries(byDist).forEach(([dist, dTeams]) => {
      const dc = DISTRICTS[dist]
      const cols = Math.ceil(Math.sqrt(dTeams.length))
      const rows = Math.ceil(dTeams.length / cols)

      dTeams.forEach((team, idx) => {
        const H   = 36 + (calcScore(team)/100)*148
        const BW  = 11 + team.members*.85
        const BD  = 9  + team.members*.70
        const col = idx % cols, row = Math.floor(idx/cols)
        const wx  = dc.cx + (col - (cols-1)/2)*44
        const wz  = dc.cz + (row - (rows-1)/2)*38

        const grp = new THREE.Group(); grp.userData = { team }
        const isCurrentUser = team.id === currentUserId

        // ── Podium ──
        const podH=7, podW=BW+11, podD=BD+9
        const pod = new THREE.Mesh(new THREE.BoxGeometry(podW,podH,podD), podMat)
        pod.position.y = podH/2; pod.castShadow=true; pod.receiveShadow=true; pod.userData={team}
        grp.add(pod); clickables.push(pod)
        const step = new THREE.Mesh(new THREE.BoxGeometry(podW-3.5,1.1,podD-3.5), podMat)
        step.position.y = podH+.55; grp.add(step)
        // lobby glass
        const lobMat = new THREE.MeshStandardMaterial({ color:new THREE.Color(dc.col).lerp(new THREE.Color(0xbce8f8),.55), roughness:.04, metalness:.90, transparent:true, opacity:.70 })
        const lob = new THREE.Mesh(new THREE.BoxGeometry(BW+5,podH*.62,.36), lobMat)
        lob.position.set(0, podH*.36, podD/2+.08); grp.add(lob)

        // ── Current-user ring glow ──
        if (isCurrentUser) {
          const ring = new THREE.Mesh(new THREE.RingGeometry(podW*.6, podW*.6+1.8, 64), new THREE.MeshBasicMaterial({ color:new THREE.Color(dc.col), transparent:true, opacity:0.65, side:THREE.DoubleSide }))
          ring.rotation.x=-Math.PI/2; ring.position.y=0.15; ring.userData={userRing:true,dc}; grp.add(ring)
          const glow = new THREE.PointLight(new THREE.Color(dc.col), 3.5, 40); glow.position.y=2; grp.add(glow)
        }

        // ── Dubai tower body (style by id) ──
        const style = team.id.charCodeAt ? (team.id.charCodeAt(team.id.length-1) % 6) : (parseInt(team.id)||0) % 6
        const gTex = makeGlassTex(dc.hex, ~~(22+H*.36))
        const gMat = new THREE.MeshStandardMaterial({ map:gTex, color:new THREE.Color(dc.col).lerp(new THREE.Color(0xc8e8f8),.32), roughness:.04, metalness:.90, emissive:new THREE.Color(dc.col), emissiveIntensity:0 })
        glassMats.push(gMat)
        const acMat = new THREE.MeshStandardMaterial({ color:dc.col, emissive:new THREE.Color(dc.em), emissiveIntensity:.35, metalness:.95, roughness:.08 })
        const yB = podH+1.1
        let beaconY = yB+H

        const addC = (geo,mat,x,y,z,cs=false) => { const m=new THREE.Mesh(geo,mat); m.position.set(x,y,z); if(cs)m.castShadow=true; m.userData={team}; grp.add(m); clickables.push(m); return m }

        if (style===0) { // tapered needle
          addC(new THREE.BoxGeometry(BW,H,BD), gMat, 0,yB+H/2,0, true)
          addC(new THREE.BoxGeometry(BW*.70,H*.30,BD*.70), gMat, 0,yB+H+H*.15,0)
          ;[.28,.56,.82].forEach(f=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(BW+1.2,1.6,BD+1.2),acMat);b.position.y=yB+H*f;grp.add(b) })
          const sp=new THREE.Mesh(new THREE.CylinderGeometry(.12,1.7,H*.34,10),metalMat);sp.position.y=yB+H+H*.30+H*.17;sp.castShadow=true;grp.add(sp)
          beaconY=yB+H+H*.30+H*.34+1.5
        } else if (style===1) { // twisted cylinder
          const N=12,sH=H/N
          for (let s=0;s<N;s++) {
            const sec=new THREE.Mesh(new THREE.CylinderGeometry(BW*.44,BW*.48,sH+.1,18),gMat)
            sec.position.y=yB+s*sH+sH/2;sec.rotation.y=s/N*Math.PI*.42;sec.userData={team};grp.add(sec)
            if(s===0||s===N-1)clickables.push(sec)
          }
          const dome=new THREE.Mesh(new THREE.SphereGeometry(BW*.48,18,10,0,Math.PI*2,0,Math.PI/2),metalMat);dome.position.y=yB+H;grp.add(dome)
          beaconY=yB+H+BW*.50+1.3
        } else if (style===2) { // arch crown
          addC(new THREE.BoxGeometry(BW,H,BD), gMat, 0,yB+H/2,0, true)
          ;[.26,.52,.78].forEach(f=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(BW+1,1.5,BD+1),acMat);b.position.y=yB+H*f;grp.add(b) })
          const arch=new THREE.Mesh(new THREE.TorusGeometry(BW*.44,1.7,8,22,Math.PI),new THREE.MeshStandardMaterial({color:0xd4c072,metalness:.94,roughness:.08}))
          arch.position.y=yB+H+BW*.44;arch.rotation.y=Math.PI*.18;arch.castShadow=true;grp.add(arch)
          beaconY=yB+H+BW*.90+1.1
        } else if (style===3) { // sail + exo-frame
          addC(new THREE.BoxGeometry(BW*1.35,H,BD*.55), gMat, 0,yB+H/2,0, true)
          ;[-1,1].forEach(s2=>{ const fin=new THREE.Mesh(new THREE.BoxGeometry(.75,H*.94,BD*.55+5),metalMat);fin.position.set(s2*(BW*1.35/2+.38),yB+H*.47,0);fin.castShadow=true;grp.add(fin) })
          const tp=new THREE.Mesh(new THREE.CylinderGeometry(.1,BW*.50,H*.26,8),gMat);tp.position.y=yB+H+H*.13;grp.add(tp)
          beaconY=yB+H+H*.26+1.1
        } else if (style===4) { // octagonal diamond
          addC(new THREE.CylinderGeometry(BW*.50,BW*.54,H,8), gMat, 0,yB+H/2,0, true)
          const crB=new THREE.Mesh(new THREE.CylinderGeometry(BW*.50,BW*.50,H*.07,8),metalMat);crB.position.y=yB+H+H*.035;grp.add(crB)
          const crT=new THREE.Mesh(new THREE.CylinderGeometry(.08,BW*.50,H*.22,8),metalMat);crT.position.y=yB+H+H*.07+H*.11;crT.castShadow=true;grp.add(crT)
          beaconY=yB+H+H*.07+H*.22+1.2
        } else { // twin towers
          const TW=BW*.44
          ;[-1,1].forEach((s2,sidx)=>{
            const tgM=new THREE.MeshStandardMaterial({ map:makeGlassTex(dc.hex,~~(18+H*.34)), color:new THREE.Color(dc.col).lerp(new THREE.Color(0xbce0f8),.28+sidx*.08), roughness:.04,metalness:.90,emissive:new THREE.Color(dc.col),emissiveIntensity:0 })
            glassMats.push(tgM)
            const tH=H*(.88+sidx*.12)
            const tm=new THREE.Mesh(new THREE.BoxGeometry(TW,tH,BD),tgM); tm.position.set(s2*(TW/2+1.1),yB+tH/2,0); tm.castShadow=true; tm.userData={team}; grp.add(tm); clickables.push(tm)
            const crn=new THREE.Mesh(new THREE.CylinderGeometry(TW*.18,TW*.48,H*.13,8),metalMat); crn.position.set(s2*(TW/2+1.1),yB+tH+H*.065,0); grp.add(crn)
            const bkM=new THREE.MeshStandardMaterial({color:new THREE.Color(dc.col),emissive:new THREE.Color(dc.col),emissiveIntensity:2.0,roughness:0,metalness:1})
            const bk=new THREE.Mesh(new THREE.SphereGeometry(1.1,8,8),bkM); bk.position.set(s2*(TW/2+1.1),yB+tH+H*.13+1.1,0); bk.userData={beacon:true}; grp.add(bk)
            const pbl=new THREE.PointLight(new THREE.Color(dc.col),3,40); pbl.position.copy(bk.position); grp.add(pbl)
            if(sidx===1) beaconY=bk.position.y
          })
          const br=new THREE.Mesh(new THREE.BoxGeometry(BW+2.2,H*.044,BD*.46),new THREE.MeshStandardMaterial({color:0x8898a8,metalness:.96,roughness:.1})); br.position.y=yB+H*.62; grp.add(br)
        }

        // Beacon (non-twin styles)
        if (style!==5) {
          const bkM = new THREE.MeshStandardMaterial({ color:new THREE.Color(dc.col),emissive:new THREE.Color(dc.col),emissiveIntensity:2.4,roughness:0,metalness:1 })
          const bk = new THREE.Mesh(new THREE.SphereGeometry(1.4,10,10),bkM); bk.position.y=beaconY; bk.userData={beacon:true}; grp.add(bk)
          const pbl = new THREE.PointLight(new THREE.Color(dc.col),4.0,55); pbl.position.y=beaconY; grp.add(pbl)
        }

        // Helipad (rank ≤5)
        if (team.rank <= 5) {
          const roofY=yB+H+1.0
          const hp=new THREE.Mesh(new THREE.CircleGeometry(5.5,36),new THREE.MeshStandardMaterial({color:0x2c3e50,roughness:.44})); hp.rotation.x=-Math.PI/2; hp.position.y=roofY; grp.add(hp)
          const hH=new THREE.Mesh(new THREE.CircleGeometry(3.8,36),new THREE.MeshStandardMaterial({color:0xf39c12,emissive:0xe67e22,emissiveIntensity:.50})); hH.rotation.x=-Math.PI/2; hH.position.y=roofY+.08; grp.add(hH)
        }

        grp.position.set(wx,0,wz); grp.scale.y=.01
        scene.add(grp); bGroups.push(grp)
      })
    })

    /* background city */
    const bgMs = [new THREE.MeshLambertMaterial({color:0xbfc8d2}),new THREE.MeshLambertMaterial({color:0xb5c0ca}),new THREE.MeshLambertMaterial({color:0xa8b5c0}),new THREE.MeshLambertMaterial({color:0xbcc7d0})]
    for (let i=0; i<85; i++) {
      const a=Math.random()*Math.PI*2, r=180+Math.random()*130, bh=10+Math.random()*60, bw2=7+Math.random()*18, bd2=6+Math.random()*14
      const bgb=new THREE.Mesh(new THREE.BoxGeometry(bw2,bh,bd2),bgMs[i%4]); bgb.position.set(Math.cos(a)*r,bh/2,Math.sin(a)*r); scene.add(bgb)
    }

    /* instanced lamp posts */
    const LAMP_N=80
    const poleI=new THREE.InstancedMesh(new THREE.CylinderGeometry(.18,.26,12,7),new THREE.MeshLambertMaterial({color:0x3a4a54}),LAMP_N)
    scene.add(poleI)
    const lampLights=[]; let lI=0
    const addLamp=(x,z)=>{ if(lI>=LAMP_N)return; dm.position.set(x,6,z);dm.scale.set(1,1,1);dm.rotation.set(0,0,0);dm.updateMatrix();poleI.setMatrixAt(lI,dm.matrix);const pl=new THREE.PointLight(0xffe5a0,0,32);pl.position.set(x,12.5,z);scene.add(pl);lampLights.push(pl);lI++ }
    ;[[1,0],[0,1],[-1,0],[0,-1]].forEach(([dx,dz])=>{ for(let d=120;d<=380;d+=26){addLamp(dx*(PLAZA_R+ROAD_W/2+d)+dz*(ROAD_W/2+8),dz*(PLAZA_R+ROAD_W/2+d)+dx*(ROAD_W/2+8));addLamp(dx*(PLAZA_R+ROAD_W/2+d)-dz*(ROAD_W/2+8),dz*(PLAZA_R+ROAD_W/2+d)-dx*(ROAD_W/2+8))} })
    for(let i=0;i<16;i++){const a=i/16*Math.PI*2;addLamp(Math.cos(a)*(PLAZA_R+ROAD_W+6),Math.sin(a)*(PLAZA_R+ROAD_W+6))}
    poleI.instanceMatrix.needsUpdate=true

    /* vehicles */
    const vehicles=[]
    const vCols=[0xc0392b,0x2471a3,0xf4d03f,0x1e8449,0xd35400,0x7d3c98,0xcb4335,0x2e86c1,0x196f3d,0xaa4400,0x1a5276,0x8e44ad]
    const addCar=(pfn,spd,col)=>{ const g=new THREE.Group(); const bm=new THREE.MeshLambertMaterial({color:col}); const body=new THREE.Mesh(new THREE.BoxGeometry(3.8,1.5,7.4),bm);body.position.y=.75;g.add(body); const cab=new THREE.Mesh(new THREE.BoxGeometry(3.2,.95,4.0),bm);cab.position.set(0,2.0,.2);g.add(cab); const wm=new THREE.MeshLambertMaterial({color:0x111111}); [[1.6,0,3.0],[1.6,0,-3.0],[-1.6,0,3.0],[-1.6,0,-3.0]].forEach(([wx,wy,wz])=>{ const w=new THREE.Mesh(new THREE.CylinderGeometry(.62,.62,.62,10),wm);w.rotation.z=Math.PI/2;w.position.set(wx,wy,wz);g.add(w) }); g.scale.setScalar(.45);g.userData={pfn,spd,t:Math.random()};scene.add(g);vehicles.push(g) }
    for(let i=0;i<12;i++){const dir=i%2?1:-1,ln=i%4<2?7:-7;addCar(t=>new THREE.Vector3(THREE.MathUtils.lerp(-320,320,t%1)*dir,.32,ln),.0012+Math.random()*.0018,vCols[i%12])}
    for(let i=0;i<12;i++){const dir=i%2?1:-1,ln=i%4<2?7:-7;addCar(t=>new THREE.Vector3(ln,.32,THREE.MathUtils.lerp(-320,320,t%1)*dir),.0012+Math.random()*.0018,vCols[(i+5)%12])}
    for(let i=0;i<10;i++){const off=i/10*Math.PI*2;addCar(t=>{const a=t*Math.PI*2+off;return new THREE.Vector3(Math.cos(a)*(PLAZA_R+ROAD_W*.5),.32,Math.sin(a)*(PLAZA_R+ROAD_W*.5))},.0007+Math.random()*.0006,vCols[(i+3)%12])}

    /* expose refs */
    sceneRef.current = { scene, skyGeo, skyColors, fog, sun, amb, hemi, sunSph, glassMats, lampLights }

    /* ── ANIMATION LOOP ── */
    let raf, t0=Date.now(), frames=0, fClock=Date.now()
    function animate() {
      raf = requestAnimationFrame(animate)
      const t = (Date.now()-t0)*.001
      frames++; if(Date.now()-fClock>1000){ onFps(frames); frames=0; fClock=Date.now() }

      // WASD fly
      const sp = keys.ShiftLeft||keys.ShiftRight ? 2.8 : .82
      const fX=Math.sin(yaw)*Math.cos(pitch), fY=-Math.sin(pitch), fZ=Math.cos(yaw)*Math.cos(pitch)
      const rX=Math.cos(yaw), rZ=-Math.sin(yaw)
      if(keys.KeyW||keys.ArrowUp)   {cam.position.x-=fX*sp;cam.position.y+=fY*sp;cam.position.z-=fZ*sp}
      if(keys.KeyS||keys.ArrowDown) {cam.position.x+=fX*sp;cam.position.y-=fY*sp;cam.position.z+=fZ*sp}
      if(keys.KeyA||keys.ArrowLeft) {cam.position.x-=rX*sp;cam.position.z-=rZ*sp}
      if(keys.KeyD||keys.ArrowRight){cam.position.x+=rX*sp;cam.position.z+=rZ*sp}
      if(keys.KeyE||keys.Space)  cam.position.y+=sp*.8
      if(keys.KeyC||keys.KeyQ)   cam.position.y-=sp*.8
      cam.position.y = Math.max(4, cam.position.y)

      // grow buildings + pulse beacon
      bGroups.forEach((g,i) => {
        if(g.scale.y<.999) g.scale.y=Math.min(1,g.scale.y+.009+i*.0003)
        g.children.forEach(c => {
          if(c.userData.beacon) c.material.emissiveIntensity=1.4+Math.sin(t*2.6+i*.55)*1.0
          if(c.userData.userRing) { c.material.opacity=0.4+Math.sin(t*3)*0.25 }
        })
      })

      haloM.lookAt(cam.position)
      clouds.forEach(cl => { cl.position.x+=cl.userData.sp; if(cl.position.x>450)cl.position.x=-450 })
      vehicles.forEach(v => {
        v.userData.t=(v.userData.t+v.userData.spd)%1
        const p=v.userData.pfn(v.userData.t), p2=v.userData.pfn((v.userData.t+.004)%1)
        v.position.copy(p); v.lookAt(p2.x,p2.y+.001,p2.z)
      })

      renderer.render(scene, cam)
    }
    animate()
    applyTod('dusk')

    const onResize = () => { VW=mount.clientWidth;VH=mount.clientHeight;cam.aspect=VW/VH;cam.updateProjectionMatrix();renderer.setSize(VW,VH) }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      mount.removeEventListener('mousedown',md); window.removeEventListener('mouseup',mu); window.removeEventListener('mousemove',mm)
      mount.removeEventListener('wheel',mw); mount.removeEventListener('click',onClick)
      window.removeEventListener('keydown',kd); window.removeEventListener('keyup',ku); window.removeEventListener('resize',onResize)
      if(mount.contains(renderer.domElement))mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [teams, currentUserId]) // rebuild if teams change

  return <div ref={mountRef} style={{ width:'100%', height:'100%', cursor:'crosshair' }}/>
}
