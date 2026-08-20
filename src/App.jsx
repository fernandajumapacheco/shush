import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Auth from './pages/Auth'
import Vault from './pages/Vault'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [masterPassword, setMasterPassword] = useState('')
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setCheckingSession(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) setMasterPassword('')
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (checkingSession) return null

  if (!session || !masterPassword) {
    return (
      <Auth
        onAuthenticated={(pwd) => setMasterPassword(pwd)}
      />
    )
  }

  return <Vault session={session} masterPassword={masterPassword} />
}

export default App
