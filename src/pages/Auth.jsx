import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth({ onAuthenticated }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else {
      onAuthenticated(password)
    }
    setLoading(false)
  }

  return (
    <div className="auth-screen">
      <h1>Shush</h1>
      <p>{isSignUp ? 'Crie sua conta' : 'Entre na sua conta'}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha-mestra"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Aguarde...' : isSignUp ? 'Cadastrar' : 'Entrar'}
        </button>
      </form>

      <button className="link-button" onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Já tenho conta' : 'Criar conta nova'}
      </button>
    </div>
  )
}
