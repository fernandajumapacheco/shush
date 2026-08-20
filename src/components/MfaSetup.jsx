import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function MfaSetup({ onClose }) {
  const [step, setStep] = useState('start')
  const [qrCode, setQrCode] = useState(null)
  const [factorId, setFactorId] = useState(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  async function startEnrollment() {
    setError('')
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' })

    if (error) {
      setError(error.message)
      return
    }

    setFactorId(data.id)
    setQrCode(data.totp.qr_code)
    setStep('scan')
  }

  async function confirmEnrollment(e) {
    e.preventDefault()
    setError('')

    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId })
    if (challengeError) {
      setError(challengeError.message)
      return
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    })

    if (verifyError) {
      setError('Código inválido. Tente novamente.')
      return
    }

    setStep('done')
  }

  return (
    <div className="mfa-setup">
      {step === 'start' && (
        <>
          <p>Adicione uma camada extra de segurança com um app autenticador (Google Authenticator, Authy, etc).</p>
          <button onClick={startEnrollment}>Ativar 2FA</button>
        </>
      )}

      {step === 'scan' && (
        <form onSubmit={confirmEnrollment}>
          <p>Escaneie o código no seu app autenticador:</p>
          <img src={qrCode} alt="QR code para configurar 2FA" className="mfa-qr" />
          <input
            type="text"
            inputMode="numeric"
            placeholder="Código de 6 dígitos"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Confirmar</button>
        </form>
      )}

      {step === 'done' && <p>2FA ativado com sucesso!</p>}

      <button className="link-button" onClick={onClose}>Fechar</button>
    </div>
  )
}
