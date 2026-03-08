import { DISTRICTS, calcScore } from './teams.js'

export default function Panels({ liveLog, teams, sel, setSel, panel, setPanel, currentUserId }) {
  const sorted = [...teams].sort((a,b) => a.rank - b.rank)

  return (
    <>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:translateX(0)}}`}</style>

      {/* BOTTOM-LEFT: legend + tabs */}
      <div style={{ position:'absolute', bottom:22, left:18, display:'flex', flexDirection:'column', gap:8, zIndex:10 }}>
        <div style={{ background:'rgba(2,6,18,.84)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,.11)', borderRadius:12, padding:'13px 17px' }}>
          {Object.entries(DISTRICTS).map(([k,d]) => (
            <div key={k} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <div style={{ width:11, height:11, borderRadius:3, background:d.hex, boxShadow:`0 0 8px ${d.hex}cc` }}/>
              <span style={{ fontSize:10.5, fontFamily:'Rajdhani', fontWeight:600, color:'rgba(255,255,255,.88)' }}>{d.label}</span>
            </div>
          ))}
          <div style={{ marginTop:9, paddingTop:9, borderTop:'1px solid rgba(255,255,255,.08)', fontSize:7.8, color:'rgba(255,255,255,.26)', lineHeight:1.75 }}>
            Drag → look · WASD fly · Scroll zoom<br/>Click building for details
          </div>
        </div>
        <div style={{ display:'flex', gap:5 }}>
          {[{k:'log',l:'Live Log'},{k:'board',l:'Leaderboard'},{k:'none',l:'Hide'}].map(({k,l}) => (
            <button key={k} onClick={()=>setPanel(p=>p===k?'none':k)} style={{ flex:1, padding:'6px 0', background:panel===k?'rgba(56,189,248,.16)':'rgba(2,6,18,.76)', border:`1px solid ${panel===k?'rgba(56,189,248,.42)':'rgba(255,255,255,.08)'}`, color:panel===k?'#38bdf8':'rgba(255,255,255,.40)', fontSize:9.5, fontFamily:'Rajdhani', fontWeight:600, letterSpacing:1, borderRadius:6, cursor:'pointer', backdropFilter:'blur(8px)', transition:'all .18s' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      {panel !== 'none' && (
        <div style={{ position:'absolute', bottom:18, right:18, width:278, background:'rgba(2,6,18,.90)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,.11)', borderRadius:14, padding:'14px 14px 12px', zIndex:10, maxHeight:480, overflow:'hidden', animation:'fadeUp .28s ease' }}>
          {panel === 'log' && (
            <>
              <div style={{ fontSize:9.5, fontFamily:'Rajdhani', fontWeight:600, color:'rgba(255,255,255,.35)', letterSpacing:2.5, marginBottom:12 }}>▸ LIVE COMMITS</div>
              {liveLog.length === 0
                ? <div style={{ fontSize:9, color:'rgba(255,255,255,.20)' }}>Waiting for commits...</div>
                : liveLog.map((c,i) => (
                  <div key={c.id} style={{ marginBottom:9, animation:'slideIn .3s ease', opacity:Math.max(.24,1-i*.092) }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:2 }}>
                      <span style={{ fontSize:9.5, fontFamily:'Rajdhani', fontWeight:700, color:c.col }}>{c.team}</span>
                      <span style={{ fontSize:7.5, color:'rgba(255,255,255,.20)' }}>{c.time}</span>
                    </div>
                    <div style={{ fontSize:8.5, color:'rgba(255,255,255,.44)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.msg}</div>
                  </div>
                ))
              }
            </>
          )}
          {panel === 'board' && (
            <>
              <div style={{ fontSize:9.5, fontFamily:'Rajdhani', fontWeight:600, color:'rgba(255,255,255,.35)', letterSpacing:2.5, marginBottom:12 }}>▸ LEADERBOARD</div>
              <div style={{ overflowY:'auto', maxHeight:415 }}>
                {sorted.map((t,i) => {
                  const dc = DISTRICTS[t.district]
                  const sc = ~~calcScore(t)
                  const isCurrent = t.id === currentUserId
                  return (
                    <div key={t.id} onClick={()=>setSel(t)} style={{ display:'flex', alignItems:'center', gap:9, padding:'7px 9px', marginBottom:2, borderRadius:7, cursor:'pointer', background: isCurrent ? `${dc.hex}18` : sel?.id===t.id ? `${dc.hex}10` : 'transparent', border:`1px solid ${isCurrent?dc.hex+'42':sel?.id===t.id?dc.hex+'22':'transparent'}`, transition:'all .15s', position:'relative' }}>
                      {isCurrent && <div style={{ position:'absolute', left:0, top:'50%', transform:'translateY(-50%)', width:2, height:'70%', background:dc.hex, borderRadius:1 }}/>}
                      <div style={{ width:22, textAlign:'center', fontSize:i<3?14:10, color:i===0?'#ffd700':i===1?'#c0c0c0':i===2?'#cd7f32':dc.hex, fontFamily:'Rajdhani', fontWeight:700 }}>{i<3?['🥇','🥈','🥉'][i]:i+1}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                          <div style={{ fontSize:9.5, color:dc.hex, fontFamily:'Rajdhani', fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.project}</div>
                          {t.isRegistered && <div style={{ width:5, height:5, borderRadius:'50%', background:'#4ade80', flexShrink:0 }}/>}
                          {isCurrent && <div style={{ fontSize:7, padding:'1px 5px', borderRadius:5, background:`${dc.hex}20`, color:dc.hex, flexShrink:0 }}>YOU</div>}
                        </div>
                        <div style={{ fontSize:7.5, color:'rgba(255,255,255,.28)' }}>{t.name}</div>
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:2 }}>
                        <span style={{ fontSize:12, fontFamily:'Rajdhani', fontWeight:700, color:'#fff' }}>{sc}</span>
                        <div style={{ width:46, height:3, background:'rgba(255,255,255,.07)', borderRadius:2 }}>
                          <div style={{ width:`${sc}%`, height:'100%', background:`linear-gradient(90deg,${dc.hex}44,${dc.hex})`, borderRadius:2 }}/>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
