import { useState, useMemo, useCallback, useEffect } from 'react'
import { DEFAULT_TEAMS, DISTRICTS, calcScore } from './teams.js'
import { getUsers, updateUserGithubData, setSession } from './storage.js'
import { fetchRepoData } from './github.js'
import CityScene from './CityScene.jsx'
import Panels from './Panels.jsx'

export default function CityPage({ user, onLogout }) {
  const [tod,    setTod]    = useState('dusk')
  const [sel,    setSel]    = useState(null)
  const [panel,  setPanel]  = useState('log')
  const [timer,  setTimer]  = useState('08:47:23')
  const [liveLog,setLog]    = useState([])
  const [fps,    setFps]    = useState(60)
  const [syncing,setSyncing]= useState(false)
  const [syncMsg,setSyncMsg]= useState('')

  /* countdown */
  useEffect(() => {
    let [h,m,s] = [8,47,23]
    const iv = setInterval(() => {
      if (--s < 0) { s=59; if(--m<0){m=59;if(--h<0){clearInterval(iv);return}} }
      setTimer(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`)
    }, 1000)
    return () => clearInterval(iv)
  }, [])

  /* live commit log */
  const allTeams = useMemo(() => buildAllTeams(), [])
  const MSGS = ['feat: transformer inference','fix: memory leak','refactor: query optimizer','feat: real-time sync','test: 96% coverage','docs: API reference updated','feat: GPU renderer v2','fix: cross-platform compat','perf: bundle size –38%','feat: multi-tenant auth','fix: async race condition','feat: offline-first PWA']
  useEffect(() => {
    const iv = setInterval(() => {
      const t = allTeams[~~(Math.random() * allTeams.length)]
      const dc = DISTRICTS[t.district]
      setLog(p => [{ id:Date.now(), team:t.name, msg:MSGS[~~(Math.random()*MSGS.length)], col:dc.hex, time:new Date().toLocaleTimeString('en',{hour12:false}) }, ...p.slice(0,9)])
    }, 2000)
    return () => clearInterval(iv)
  }, [allTeams])

  /* re-sync user's GitHub data */
  const handleSync = useCallback(async () => {
    if (!user.githubUrl) return
    setSyncing(true); setSyncMsg('')
    try {
      const data = await fetchRepoData(user.githubUrl)
      const updated = updateUserGithubData(user.email, data)
      if (updated) { setSession(updated); setSyncMsg('✓ Synced successfully!') }
    } catch(e) {
      setSyncMsg(`✗ ${e.message}`)
    } finally {
      setSyncing(false)
      setTimeout(() => setSyncMsg(''), 4000)
    }
  }, [user])

  const teamsForCity = useMemo(() => buildAllTeams(), [syncing])

  return (
    <div style={{ position:'relative', width:'100vw', height:'100vh', overflow:'hidden', background:'#020612', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:.30} 50%{opacity:1} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:2px}
      `}</style>

      {/* 3D CITY */}
      <CityScene teams={teamsForCity} currentUserId={user.id} onSelect={setSel} tod={tod} onFps={setFps}/>

      {/* TOP BAR */}
      <div style={{ position:'absolute', top:0, left:0, right:0, padding:'14px 26px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(180deg,rgba(2,6,18,.92)0%,transparent)', zIndex:10, pointerEvents:'none' }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ fontFamily:'Rajdhani', fontWeight:700, fontSize:26, letterSpacing:4, color:'#fff' }}>CODE<span style={{ color:'#38bdf8' }}>CITY</span></div>
          <div style={{ width:1, height:28, background:'rgba(255,255,255,.14)' }}/>
          <div>
            <div style={{ fontSize:10.5, fontFamily:'Rajdhani', fontWeight:600, color:'rgba(255,255,255,.78)', letterSpacing:2.5 }}>HACKFUSION 2026</div>
            <div style={{ fontSize:7.5, color:'rgba(255,255,255,.28)', letterSpacing:1.5 }}>INTERACTIVE 3D CITY</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:26, alignItems:'center' }}>
          {[{v:teamsForCity.length,l:'TEAMS'},{v:teamsForCity.reduce((a,t)=>a+t.commits,0).toLocaleString(),l:'COMMITS'},{v:'4',l:'DISTRICTS'},{v:fps,l:'FPS'}].map(({v,l}) => (
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontSize:20, fontFamily:'Rajdhani', fontWeight:700, color:'#fff', lineHeight:1 }}>{v}</div>
              <div style={{ fontSize:7, color:'rgba(255,255,255,.32)', letterSpacing:2, marginTop:2 }}>{l}</div>
            </div>
          ))}
          <div style={{ width:1, height:22, background:'rgba(255,255,255,.12)' }}/>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:20, fontFamily:'Rajdhani', fontWeight:700, color:'#f87171', lineHeight:1, animation:'pulse 1.5s infinite' }}>{timer}</div>
            <div style={{ fontSize:7, color:'rgba(255,255,255,.32)', letterSpacing:2, marginTop:2 }}>REMAINING</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 10px #4ade80', animation:'pulse 1.2s infinite' }}/>
            <span style={{ fontSize:10, fontFamily:'Rajdhani', fontWeight:700, color:'#4ade80', letterSpacing:2 }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* TOD CONTROLS */}
      <div style={{ position:'absolute', top:68, right:22, display:'flex', gap:6, zIndex:10 }}>
        {[{k:'day',i:'☀️',l:'Day'},{k:'dusk',i:'🌅',l:'Dusk'},{k:'night',i:'🌙',l:'Night'}].map(({k,i,l}) => (
          <button key={k} onClick={()=>setTod(k)} style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 14px', background:tod===k?'rgba(56,189,248,.18)':'rgba(2,6,18,.70)', border:`1px solid ${tod===k?'rgba(56,189,248,.50)':'rgba(255,255,255,.10)'}`, color:tod===k?'#38bdf8':'rgba(255,255,255,.44)', fontSize:10.5, fontFamily:'Rajdhani', fontWeight:600, letterSpacing:1, borderRadius:7, cursor:'pointer', backdropFilter:'blur(12px)', transition:'all .18s' }}>
            <span>{i}</span><span>{l}</span>
          </button>
        ))}
      </div>

      {/* USER BADGE (bottom-right of top bar) */}
      <div style={{ position:'absolute', top:14, right:22, zIndex:10, display:'flex', alignItems:'center', gap:8 }}>
        {syncMsg && <div style={{ fontSize:10.5, color: syncMsg.startsWith('✓') ? '#4ade80' : '#f87171', background:'rgba(2,6,18,.8)', padding:'4px 12px', borderRadius:6, border:'1px solid rgba(255,255,255,.1)' }}>{syncMsg}</div>}
        <button onClick={handleSync} disabled={syncing} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', background:'rgba(2,6,18,.75)', border:'1px solid rgba(255,255,255,.12)', borderRadius:7, color:'rgba(255,255,255,.55)', fontSize:10, fontFamily:'Rajdhani', fontWeight:600, letterSpacing:1, cursor:syncing?'default':'pointer', backdropFilter:'blur(10px)' }}>
          <span style={{ display:'inline-block', animation: syncing ? 'spin .8s linear infinite' : 'none' }}>⟳</span> SYNC
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:9, padding:'6px 14px', background:'rgba(2,6,18,.78)', border:'1px solid rgba(255,255,255,.11)', borderRadius:8, backdropFilter:'blur(12px)' }}>
          <div style={{ width:28, height:28, borderRadius:'50%', background:`linear-gradient(135deg,${DISTRICTS[user.district]?.hex||'#38bdf8'},${DISTRICTS[user.district]?.em?'#'+DISTRICTS[user.district].em.toString(16):'#0369a1'})`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Rajdhani', fontWeight:700, fontSize:12, color:'#fff' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize:11, fontFamily:'Rajdhani', fontWeight:700, color:'#fff', lineHeight:1 }}>{user.name}</div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,.38)', lineHeight:1, marginTop:2 }}>{user.teamName}</div>
          </div>
          <button onClick={onLogout} style={{ marginLeft:4, background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.1)', color:'rgba(255,255,255,.45)', width:24, height:24, borderRadius:6, cursor:'pointer', fontSize:12 }}>↩</button>
        </div>
      </div>

      {/* PANELS (log, leaderboard, legend) */}
      <Panels liveLog={liveLog} teams={teamsForCity} sel={sel} setSel={setSel} panel={panel} setPanel={setPanel} currentUserId={user.id}/>

      {/* BUILDING DETAIL */}
      {sel && <BuildingDetail team={sel} onClose={()=>setSel(null)} isCurrentUser={sel.id === user.id}/>}
    </div>
  )
}

/* ── Build combined teams list ── */
function buildAllTeams() {
  const registered = getUsers().map(u => ({
    id: u.id,
    name: u.teamName,
    project: u.projectName,
    district: u.district,
    commits: u.githubData?.commits || 20,
    quality: u.githubData?.quality || 50,
    docs:    u.githubData?.docs    || 50,
    testing: u.githubData?.testing || 50,
    collab:  u.githubData?.collab  || 50,
    innovation: u.githubData?.innovation || 50,
    members: u.githubData?.members || 2,
    isRegistered: true,
    githubUrl: u.githubUrl,
    githubData: u.githubData,
    ownerName: u.name,
  }))
  const all = [...DEFAULT_TEAMS, ...registered].sort((a,b) => calcScore(b) - calcScore(a))
  all.forEach((t,i) => { t.rank = i+1 })
  return all
}

/* ── Building detail panel ── */
function BuildingDetail({ team, onClose, isCurrentUser }) {
  const d = DISTRICTS[team.district]
  const sc = Math.round(calcScore(team))
  return (
    <div style={{ position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)', width:600, background:'rgba(2,6,18,.96)', backdropFilter:'blur(28px)', border:`1px solid ${d.hex}28`, borderRadius:18, padding:26, zIndex:20, boxShadow:`0 20px 70px rgba(0,0,0,.55),0 0 40px ${d.hex}0c`, animation:'fadeUp .24s ease' }}>
      <button onClick={onClose} style={{ position:'absolute', top:14, right:15, background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.12)', color:'rgba(255,255,255,.55)', width:29, height:29, borderRadius:8, cursor:'pointer', fontSize:17 }}>×</button>
      {isCurrentUser && <div style={{ position:'absolute', top:14, left:26, fontSize:9, padding:'3px 10px', borderRadius:10, background:'rgba(56,189,248,.14)', border:'1px solid rgba(56,189,248,.32)', color:'#38bdf8', fontFamily:'Rajdhani', fontWeight:600, letterSpacing:1.5 }}>YOUR BUILDING</div>}
      <div style={{ display:'flex', gap:26, marginTop: isCurrentUser ? 28 : 0 }}>
        <div style={{ flex:'0 0 210px' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'4px 13px', borderRadius:20, background:`${d.hex}12`, border:`1px solid ${d.hex}28`, marginBottom:11 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:d.hex, boxShadow:`0 0 8px ${d.hex}` }}/>
            <span style={{ fontSize:9, fontFamily:'Rajdhani', fontWeight:600, color:d.hex, letterSpacing:1.5 }}>{d.label} · Rank #{team.rank}</span>
          </div>
          <div style={{ fontSize:22, fontFamily:'Rajdhani', fontWeight:700, color:'#fff', lineHeight:1.1, marginBottom:4 }}>{team.project}</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,.38)', marginBottom:16 }}>{team.name}{team.ownerName?` · ${team.ownerName}`:''} · {team.members} engineers</div>
          <div style={{ display:'flex', gap:20, marginBottom:16 }}>
            {[{v:team.commits,l:'Commits'},{v:sc,l:'Score'},{v:team.members,l:'Team'}].map(({v,l}) => (
              <div key={l}><div style={{ fontSize:28, fontFamily:'Rajdhani', fontWeight:700, color:'#fff', lineHeight:1 }}>{v}</div><div style={{ fontSize:8.5, color:'rgba(255,255,255,.30)', marginTop:2 }}>{l}</div></div>
            ))}
          </div>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:12 }}>
            {team.rank<=5&&<span style={{ fontSize:8, padding:'3px 9px', borderRadius:10, background:'rgba(251,191,36,.10)', border:'1px solid rgba(251,191,36,.24)', color:'#fbbf24' }}>🚁 Helipad</span>}
            {team.rank<=4&&<span style={{ fontSize:8, padding:'3px 9px', borderRadius:10, background:`${d.hex}12`, border:`1px solid ${d.hex}2e`, color:d.hex }}>📡 Spire</span>}
            {team.innovation>=90&&<span style={{ fontSize:8, padding:'3px 9px', borderRadius:10, background:'rgba(139,92,246,.16)', border:'1px solid rgba(167,139,250,.26)', color:'#c084fc' }}>⚡ Elite</span>}
            {team.isRegistered&&<span style={{ fontSize:8, padding:'3px 9px', borderRadius:10, background:'rgba(74,222,128,.10)', border:'1px solid rgba(74,222,128,.26)', color:'#4ade80' }}>⛓ Live GitHub</span>}
          </div>
          {team.githubData && (
            <div style={{ fontSize:10, color:'rgba(255,255,255,.30)', lineHeight:1.7 }}>
              {team.githubData.language && <div>🔤 {team.githubData.language}</div>}
              {team.githubData.stars>0 && <div>⭐ {team.githubData.stars} stars · 🍴{team.githubData.forks} forks</div>}
              {team.githubUrl && <a href={team.githubUrl} target="_blank" rel="noreferrer" style={{ color:'#38bdf8', fontSize:9.5 }}>View on GitHub →</a>}
            </div>
          )}
        </div>
        <div style={{ width:1, background:'rgba(255,255,255,.07)', flexShrink:0 }}/>
        <div style={{ flex:1, paddingTop:4 }}>
          {[{l:'Code Quality',v:team.quality},{l:'Documentation',v:team.docs},{l:'Test Coverage',v:team.testing},{l:'Collaboration',v:team.collab},{l:'Innovation',v:team.innovation}].map(m => (
            <div key={m.l} style={{ marginBottom:13 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <span style={{ fontSize:9.5, color:'rgba(255,255,255,.40)' }}>{m.l}</span>
                <span style={{ fontSize:12, fontFamily:'Rajdhani', fontWeight:700, color:'#fff' }}>{m.v}<span style={{ fontSize:8, color:'rgba(255,255,255,.24)' }}>%</span></span>
              </div>
              <div style={{ height:5, background:'rgba(255,255,255,.06)', borderRadius:5, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${m.v}%`, background:`linear-gradient(90deg,${d.hex}40,${d.hex})`, borderRadius:5, transition:'width 1.1s ease', boxShadow:`0 0 10px ${d.hex}40` }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
