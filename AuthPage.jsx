import { useState } from 'react'
import { getUserByEmail, saveUser, setSession } from './storage.js'
import { fetchRepoData } from './github.js'
import { DISTRICTS } from './teams.js'

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [step, setStep] = useState(1)
  const [err,  setErr]  = useState('')
  const [loading, setLoading] = useState(false)

  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [name, setName]           = useState('')
  const [regEmail, setRegEmail]   = useState('')
  const [regPass, setRegPass]     = useState('')
  const [teamName, setTeamName]   = useState('')
  const [projectName, setProjectName] = useState('')
  const [district, setDistrict]   = useState('AI')
  const [githubUrl, setGithubUrl] = useState('')
  const [githubData, setGithubData] = useState(null)
  const [fetchMsg, setFetchMsg]   = useState('')

  const inputStyle = {
    width:'100%', padding:'10px 14px',
    background:'rgba(255,255,255,.06)',
    border:'1px solid rgba(255,255,255,.13)',
    borderRadius:'9px', color:'#fff',
    fontSize:'13px', outline:'none',
    marginBottom:'11px', boxSizing:'border-box',
    transition:'border-color .2s',
    fontFamily:"'DM Sans',sans-serif",
  }

  const primaryBtn = {
    width:'100%', padding:'12px', borderRadius:'10px', cursor:'pointer',
    fontSize:'13px', fontFamily:'Rajdhani', fontWeight:'700', letterSpacing:'1.5px',
    border:'1px solid rgba(56,189,248,.50)',
    background:'rgba(56,189,248,.18)', color:'#38bdf8', transition:'all .18s',
  }

  const secondaryBtn = {
    width:'100%', padding:'12px', borderRadius:'10px', cursor:'pointer',
    fontSize:'13px', fontFamily:'Rajdhani', fontWeight:'700', letterSpacing:'1.5px',
    border:'1px solid rgba(255,255,255,.12)',
    background:'rgba(255,255,255,.06)', color:'rgba(255,255,255,.55)', transition:'all .18s',
  }

  const handleLogin = () => {
    setErr('')
    const u = getUserByEmail(email)
    if (!u || u.password !== password) { setErr('Invalid email or password.'); return }
    setSession(u); onLogin(u)
  }

  const handleNext = () => {
    setErr('')
    if (step === 1) {
      if (!name || !regEmail || !regPass) { setErr('Please fill all fields.'); return }
      if (getUserByEmail(regEmail)) { setErr('Email already registered.'); return }
      setStep(2)
    } else if (step === 2) {
      if (!teamName || !projectName) { setErr('Please fill all fields.'); return }
      setStep(3)
    }
  }

  const handleFetch = async () => {
    if (!githubUrl) { setFetchMsg('Please enter a GitHub URL.'); return }
    setLoading(true); setFetchMsg('')
    try {
      const data = await fetchRepoData(githubUrl)
      setGithubData(data)
      setFetchMsg('✓ Fetched!')
    } catch(e) {
      setFetchMsg('✗ ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = () => {
    const id = 'u_' + Date.now()
    const user = {
      id, name, email: regEmail.toLowerCase(), password: regPass,
      teamName, projectName, district,
      githubUrl: githubUrl || null,
      githubData: githubData || null,
      lastSync: githubData ? new Date().toISOString() : null,
    }
    saveUser(user); setSession(user); onLogin(user)
  }

  return (
    <div style={{ width:'100vw', height:'100vh', background:'#020612', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(56,189,248,.07) 1px,transparent 1px)', backgroundSize:'38px 38px', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', width:'500px', height:'500px', background:'radial-gradient(circle,rgba(56,189,248,.06),transparent 70%)', top:'-100px', left:'-100px', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', width:'400px', height:'400px', background:'radial-gradient(circle,rgba(244,114,182,.05),transparent 70%)', bottom:'-80px', right:'-80px', pointerEvents:'none' }}/>

      <div style={{ width:'460px', background:'rgba(2,6,18,.97)', backdropFilter:'blur(28px)', border:'1px solid rgba(56,189,248,.20)', borderRadius:'20px', padding:'40px', boxShadow:'0 24px 80px rgba(0,0,0,.65),0 0 60px rgba(56,189,248,.07)', position:'relative', zIndex:1, animation:'fadeUp .4s ease' }}>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'28px' }}>
          <div style={{ fontFamily:'Rajdhani', fontWeight:700, fontSize:32, letterSpacing:'5px', color:'#fff' }}>
            CODE<span style={{ color:'#38bdf8' }}>CITY</span>
          </div>
          <div style={{ fontSize:'10px', color:'rgba(255,255,255,.28)', letterSpacing:'3px', marginTop:'5px' }}>HACKFUSION 2026</div>
        </div>

        {mode === 'login' ? (
          <>
            <div style={{ fontSize:'12px', color:'rgba(255,255,255,.35)', marginBottom:'20px', textAlign:'center', letterSpacing:'1px' }}>SIGN IN TO YOUR CITY</div>
            <input style={inputStyle} placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()} onFocus={e=>e.target.style.borderColor='rgba(56,189,248,.45)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.13)'}/>
            <input style={inputStyle} placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()} onFocus={e=>e.target.style.borderColor='rgba(56,189,248,.45)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.13)'}/>
            {err && <div style={{ fontSize:'11px', color:'#f87171', marginBottom:'10px' }}>{err}</div>}
            <button style={primaryBtn} onClick={handleLogin}>ENTER CITY</button>
            <div style={{ textAlign:'center', marginTop:'18px', fontSize:'12px', color:'rgba(255,255,255,.30)' }}>
              No account?{' '}
              <span onClick={()=>{setMode('register');setStep(1);setErr('')}} style={{ color:'#38bdf8', cursor:'pointer' }}>Register your team</span>
            </div>
          </>
        ) : (
          <>
            {/* Step indicators */}
            <div style={{ display:'flex', gap:'6px', marginBottom:'24px', justifyContent:'center', alignItems:'center' }}>
              {[1,2,3].map((n,i) => (
                <div key={n} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                  <div style={{ width:'26px', height:'26px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontFamily:'Rajdhani', fontWeight:'700', background:step>=n?'rgba(56,189,248,.22)':'rgba(255,255,255,.06)', border:`1px solid ${step>=n?'rgba(56,189,248,.55)':'rgba(255,255,255,.12)'}`, color:step>=n?'#38bdf8':'rgba(255,255,255,.30)', transition:'all .3s' }}>{n}</div>
                  {i < 2 && <div style={{ width:'28px', height:'1px', background:step>n?'rgba(56,189,248,.40)':'rgba(255,255,255,.08)' }}/>}
                </div>
              ))}
            </div>

            {step === 1 && (
              <>
                <div style={{ fontSize:'11px', color:'rgba(255,255,255,.35)', marginBottom:'14px', letterSpacing:'1.5px' }}>ACCOUNT DETAILS</div>
                <input style={inputStyle} placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} onFocus={e=>e.target.style.borderColor='rgba(56,189,248,.45)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.13)'}/>
                <input style={inputStyle} placeholder="Email" type="email" value={regEmail} onChange={e=>setRegEmail(e.target.value)} onFocus={e=>e.target.style.borderColor='rgba(56,189,248,.45)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.13)'}/>
                <input style={inputStyle} placeholder="Password" type="password" value={regPass} onChange={e=>setRegPass(e.target.value)} onFocus={e=>e.target.style.borderColor='rgba(56,189,248,.45)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.13)'}/>
                {err && <div style={{ fontSize:'11px', color:'#f87171', marginBottom:'10px' }}>{err}</div>}
                <button style={primaryBtn} onClick={handleNext}>Continue →</button>
              </>
            )}

            {step === 2 && (
              <>
                <div style={{ fontSize:'11px', color:'rgba(255,255,255,.35)', marginBottom:'14px', letterSpacing:'1.5px' }}>TEAM INFO</div>
                <input style={inputStyle} placeholder="Team name" value={teamName} onChange={e=>setTeamName(e.target.value)} onFocus={e=>e.target.style.borderColor='rgba(56,189,248,.45)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.13)'}/>
                <input style={inputStyle} placeholder="Project name" value={projectName} onChange={e=>setProjectName(e.target.value)} onFocus={e=>e.target.style.borderColor='rgba(56,189,248,.45)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.13)'}/>
                <div style={{ fontSize:'11px', color:'rgba(255,255,255,.35)', marginBottom:'9px', letterSpacing:'1.5px' }}>DISTRICT</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'7px', marginBottom:'14px' }}>
                  {Object.entries(DISTRICTS).map(([k,d]) => (
                    <div key={k} onClick={()=>setDistrict(k)} style={{ padding:'10px 12px', borderRadius:'9px', cursor:'pointer', background:district===k?`${d.hex}18`:'rgba(255,255,255,.04)', border:`1px solid ${district===k?d.hex+'44':'rgba(255,255,255,.09)'}`, transition:'all .15s' }}>
                      <div style={{ fontSize:'11px', fontFamily:'Rajdhani', fontWeight:'700', color:district===k?d.hex:'rgba(255,255,255,.55)', letterSpacing:'1px' }}>{k}</div>
                      <div style={{ fontSize:'9px', color:'rgba(255,255,255,.25)', marginTop:'2px' }}>{d.label}</div>
                    </div>
                  ))}
                </div>
                {err && <div style={{ fontSize:'11px', color:'#f87171', marginBottom:'10px' }}>{err}</div>}
                <div style={{ display:'flex', gap:'8px' }}>
                  <button style={{ ...secondaryBtn, width:'auto', padding:'11px 20px' }} onClick={()=>setStep(1)}>← Back</button>
                  <button style={primaryBtn} onClick={handleNext}>Continue →</button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div style={{ fontSize:'11px', color:'rgba(255,255,255,.35)', marginBottom:'14px', letterSpacing:'1.5px' }}>GITHUB REPOSITORY</div>
                <div style={{ display:'flex', gap:'8px', marginBottom:'8px' }}>
                  <input style={{ ...inputStyle, marginBottom:0, flex:1 }} placeholder="https://github.com/owner/repo" value={githubUrl} onChange={e=>setGithubUrl(e.target.value)} onFocus={e=>e.target.style.borderColor='rgba(56,189,248,.45)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.13)'}/>
                  <button onClick={handleFetch} disabled={loading} style={{ padding:'10px 16px', borderRadius:'9px', cursor:'pointer', background:'rgba(56,189,248,.16)', border:'1px solid rgba(56,189,248,.35)', color:'#38bdf8', fontFamily:'Rajdhani', fontWeight:'700', fontSize:'11px', letterSpacing:'1px', whiteSpace:'nowrap', flexShrink:0 }}>
                    {loading ? '...' : 'FETCH'}
                  </button>
                </div>
                {fetchMsg && <div style={{ fontSize:'11px', color:fetchMsg.startsWith('✓')?'#4ade80':'#f87171', marginBottom:'10px' }}>{fetchMsg}</div>}
                {githubData && (
                  <div style={{ background:'rgba(255,255,255,.05)', borderRadius:'10px', padding:'13px 15px', marginBottom:'12px', fontSize:'11px', color:'rgba(255,255,255,.55)', lineHeight:'1.85', border:'1px solid rgba(255,255,255,.08)' }}>
                    <div style={{ color:'#fff', fontFamily:'Rajdhani', fontWeight:'700', fontSize:'13px', marginBottom:'6px' }}>{githubData.repoFullName}</div>
                    <div>🔤 {githubData.language} · ⭐{githubData.stars} · 🍴{githubData.forks} · 👥{githubData.members} members</div>
                    <div style={{ display:'flex', gap:'18px', marginTop:'8px' }}>
                      {[['Quality',githubData.quality,'#38bdf8'],['Docs',githubData.docs,'#4ade80'],['Innovation',githubData.innovation,'#fbbf24']].map(([l,v,c])=>(
                        <div key={l}><div style={{ fontSize:'20px', fontFamily:'Rajdhani', fontWeight:'700', color:c }}>{v}</div><div style={{ fontSize:'8px', color:'rgba(255,255,255,.28)' }}>{l}</div></div>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ fontSize:'10px', color:'rgba(255,255,255,.22)', marginBottom:'14px' }}>GitHub is optional — skip to use default scores.</div>
                <div style={{ display:'flex', gap:'8px' }}>
                  <button style={{ ...secondaryBtn, width:'auto', padding:'11px 20px' }} onClick={()=>setStep(2)}>← Back</button>
                  <button style={primaryBtn} onClick={handleRegister}>🏙️ Build My Building</button>
                </div>
              </>
            )}

            <div style={{ textAlign:'center', marginTop:'16px', fontSize:'11px', color:'rgba(255,255,255,.30)' }}>
              Have an account?{' '}
              <span onClick={()=>{setMode('login');setErr('')}} style={{ color:'#38bdf8', cursor:'pointer' }}>Sign in</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
