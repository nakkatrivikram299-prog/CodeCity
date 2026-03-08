import * as THREE from 'three'

function mkTex(fn, w = 256, h = 256) {
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  fn(c, c.getContext('2d'))
  return new THREE.CanvasTexture(c)
}
function rep(t, rx, ry) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); return t }

export const makeGrassTex = () => rep(mkTex((c, x) => {
  c.width = c.height = 512
  x.fillStyle = '#3d7020'; x.fillRect(0, 0, 512, 512)
  for (let i = 0; i < 1800; i++) {
    const b = 0.6 + Math.random() * 0.8
    x.fillStyle = `rgba(${~~(22*b)},${~~(95*b)},${~~(14*b)},0.22)`
    x.beginPath(); x.ellipse(Math.random()*512, Math.random()*512, Math.random()*10+2, Math.random()*4+1, Math.random()*Math.PI, 0, Math.PI*2); x.fill()
  }
}, 512, 512), 22, 22)

export const makeRoadTex = () => rep(mkTex((c, x) => {
  c.width = c.height = 512
  x.fillStyle = '#1c1c1c'; x.fillRect(0, 0, 512, 512)
  for (let i = 0; i < 500; i++) { x.fillStyle = `rgba(255,255,255,${Math.random()*.016})`; x.fillRect(Math.random()*512, Math.random()*512, Math.random()*3+1, 2) }
  x.fillStyle = 'rgba(235,235,235,0.96)'; x.fillRect(0, 0, 512, 7); x.fillRect(0, 505, 512, 7)
  x.strokeStyle = 'rgba(255,200,0,0.96)'; x.lineWidth = 5.5; x.setLineDash([40, 25])
  x.beginPath(); x.moveTo(256, 0); x.lineTo(256, 512); x.stroke(); x.setLineDash([])
  x.strokeStyle = 'rgba(255,255,255,0.11)'; x.lineWidth = 2.5; x.setLineDash([22, 16])
  ;[128, 384].forEach(lx => { x.beginPath(); x.moveTo(lx, 0); x.lineTo(lx, 512); x.stroke() })
  x.setLineDash([])
}, 512, 512), 1, 16)

export const makePaveTex = () => rep(mkTex((c, x) => {
  c.width = c.height = 256; x.fillStyle = '#c2baa6'; x.fillRect(0, 0, 256, 256)
  const s = 36
  for (let r = 0; r < 7; r++) for (let col = 0; col < 7; col++) {
    const sh = (r % 2) * 18
    x.strokeStyle = `rgba(0,0,0,${0.055 + Math.random() * 0.04})`; x.lineWidth = 1.2
    x.strokeRect(col*s+sh+0.5, r*s+0.5, s-1, s-1)
    if ((r+col) % 3 === 0) { x.fillStyle = 'rgba(0,0,0,0.025)'; x.fillRect(col*s+sh+1, r*s+1, s-2, s-2) }
  }
}), 8, 8)

export const makeWaterTex = () => rep(mkTex((c, x) => {
  c.width = c.height = 256
  const g = x.createLinearGradient(0, 0, 256, 256)
  g.addColorStop(0, '#1462a0'); g.addColorStop(1, '#0c4480')
  x.fillStyle = g; x.fillRect(0, 0, 256, 256)
  x.strokeStyle = 'rgba(255,255,255,0.10)'; x.lineWidth = 1.6
  for (let i = 0; i < 20; i++) { const y = Math.random()*256; x.beginPath(); x.moveTo(0,y); x.bezierCurveTo(80,y-6,175,y+6,256,y); x.stroke() }
}), 4, 4)

/** Dubai-style curtain-wall glass: dark tinted, mullions, sky reflection */
export function makeGlassTex(distHex, floors = 32) {
  const T = mkTex((c, x) => {
    c.width = 256; c.height = 1024
    const bg = x.createLinearGradient(0, 0, 0, 1024)
    bg.addColorStop(0, '#09111e'); bg.addColorStop(0.5, '#0b1624'); bg.addColorStop(1, '#060e18')
    x.fillStyle = bg; x.fillRect(0, 0, 256, 1024)
    // sky reflection
    const sk = x.createLinearGradient(0, 0, 180, 300)
    sk.addColorStop(0, 'rgba(110,175,220,0.20)'); sk.addColorStop(1, 'rgba(50,90,150,0)')
    x.fillStyle = sk; x.fillRect(0, 0, 256, 1024)
    const fh = 1024 / floors
    for (let f = 0; f < floors; f++) {
      const y = f * fh
      x.fillStyle = 'rgba(40,60,80,0.90)'; x.fillRect(0, y, 256, fh * 0.15)
      const br = 0.50 + Math.random() * 0.60
      x.fillStyle = `rgba(${~~(14*br)},${~~(38*br)},${~~(78*br)},0.95)`; x.fillRect(2, y + fh*0.15, 252, fh*0.85)
      if (Math.random() > 0.74) {
        x.fillStyle = 'rgba(255,245,180,0.14)'
        const nw = Math.floor(2 + Math.random() * 3), ww = 48, wp = (256 - nw*ww)/(nw+1)
        for (let w = 0; w < nw; w++) x.fillRect(wp+(ww+wp)*w, y+fh*0.22, ww, fh*0.56)
      }
    }
    for (let mx = 0; mx < 256; mx += 64) { x.fillStyle = 'rgba(50,80,100,0.45)'; x.fillRect(mx, 0, 2, 1024) }
    const eg = x.createLinearGradient(0, 0, 32, 0)
    eg.addColorStop(0, 'rgba(180,220,255,0.13)'); eg.addColorStop(1, 'transparent')
    x.fillStyle = eg; x.fillRect(0, 0, 32, 1024)
    // district tint
    const dc = parseInt(distHex.replace('#', ''), 16)
    x.fillStyle = `rgba(${(dc>>16)&255},${(dc>>8)&255},${dc&255},0.08)`; x.fillRect(0, 0, 256, 1024)
  }, 256, 1024)
  T.wrapS = T.wrapT = THREE.RepeatWrapping
  return T
}
