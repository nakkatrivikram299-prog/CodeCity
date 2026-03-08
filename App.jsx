import { useState, useEffect } from 'react'
import { getSession, clearSession } from './storage.js'
import AuthPage from './AuthPage.jsx'
import CityPage from './CityPage.jsx'

export default function App() {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = getSession()
    if (session) setUser(session)
    setLoading(false)
  }, [])

  const handleLogin = (u) => {
    setUser(u)
  }

  const handleLogout = () => {
    clearSession()
    setUser(null)
  }

  if (loading) {
    return (
      <div style={{ width:'100vw', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#020612' }}>
        <div style={{ fontFamily:'Rajdhani', fontWeight:700, fontSize:26, letterSpacing:4, color:'#fff' }}>
          CODE<span style={{ color:'#38bdf8' }}>CITY</span>
          <span style={{ color:'rgba(255,255,255,0.30)', fontSize:14, marginLeft:12 }}>Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage onLogin={handleLogin} />
  }

  return <CityPage user={user} onLogout={handleLogout} />
}
