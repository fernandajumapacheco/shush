import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { checkPasswordStrength } from '../lib/passwordStrength'
import MfaChallenge from './MfaChallenge'
import PasswordField from '../components/PasswordField'

export default function Auth({ onAuthenticated }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [mfaFactorId, setMfaFactorId] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')

    if (isSignUp) {
      const strengthError = checkPasswordStrength(password)
      if (strengthError) {
        setError(strengthError)
        return
      }
    }

    setLoading(true)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setInfo('Conta criada! Verifique seu e-mail para confirmar antes de entrar.')
        setIsSignUp(false)
      }
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    const { data: factorsData } = await supabase.auth.mfa.listFactors()
    const verifiedFactor = factorsData?.totp?.find((f) => f.status === 'verified')

    if (verifiedFactor) {
      setMfaFactorId(verifiedFactor.id)
      setLoading(false)
      return
    }

    onAuthenticated(password)
    setLoading(false)
  }

  if (mfaFactorId) {
    return (
      <MfaChallenge
        factorId={mfaFactorId}
        onVerified={() => onAuthenticated(password)}
        onCancel={() => {
          supabase.auth.signOut()
          setMfaFactorId(null)
        }}
      />
    )
  }

  return (
    <div className="auth-screen">
      <div className="login-brand">
        <h1 className="shush-logo">
          Shush<span className="frog">🐸</span>
        </h1>
        <p className="login-subtitle">{isSignUp ? 'Crie sua conta' : 'Entre na sua conta'}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="icon-field icon-field-email">
          <span className="field-icon">👤</span>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="icon-field icon-field-password">
          <span className="field-icon">🔒</span>
          <PasswordField
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={12}
          />
        </div>
        {isSignUp && (
          <p className="hint">Mínimo 12 caracteres, com maiúsculas, minúsculas e números.</p>
        )}
        {error && <p className="error">{error}</p>}
        {info && <p className="info">{info}</p>}
        <button type="submit" className="btn-mascot" disabled={loading}>
          <span className="mascot-inline">🐸</span>
          {loading ? 'Aguarde...' : isSignUp ? 'Cadastrar' : 'Entrar'}
        </button>
      </form>

      <button
        className="link-button"
        onClick={() => {
          setIsSignUp(!isSignUp)
          setError('')
          setInfo('')
        }}
      >
        {isSignUp ? 'Já tenho conta' : 'Criar conta nova'}
      </button>
    </div>
  )
}
