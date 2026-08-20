import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function MfaChallenge({ factorId, onVerified, onCancel }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId })
    if (challengeError) {
      setError(challengeError.message)
      setLoading(false)
      return
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    })

    if (verifyError) {
      setError('Código inválido. Tente novamente.')
      setLoading(false)
      return
    }

    onVerified()
  }

  return (
    <div className="auth-screen">
      <h1>Shush</h1>
      <p>Digite o código do seu app autenticador</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Código de 6 dígitos"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          required
          autoFocus
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Verificando...' : 'Confirmar'}
        </button>
      </form>

      <button className="link-button" onClick={onCancel}>
        Cancelar
      </button>
    </div>
  )
}
