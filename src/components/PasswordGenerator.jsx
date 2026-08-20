import { useState } from 'react'
import { generatePassword, passwordStrengthScore } from '../lib/generatePassword'

const FACES = ['😴', '😕', '🙂', '😄', '🤩']
const LABELS = ['Muito fraca', 'Fraca', 'Ok', 'Forte', 'Excelente']

export default function PasswordGenerator({ onUse }) {
  const [open, setOpen] = useState(false)
  const [length, setLength] = useState(16)
  const [useUpper, setUseUpper] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [generated, setGenerated] = useState('')

  function handleGenerate() {
    setGenerated(generatePassword({ length, useUpper, useNumbers, useSymbols }))
  }

  const score = passwordStrengthScore(generated)

  if (!open) {
    return (
      <button type="button" className="link-button generator-toggle" onClick={() => { setOpen(true); handleGenerate() }}>
        🎲 Gerar senha
      </button>
    )
  }

  return (
    <div className="password-generator">
      <div className="generator-display">
        <span className="generator-face">{generated ? FACES[score] : '🙂'}</span>
        <code>{generated}</code>
      </div>

      {generated && (
        <div className="strength-bar">
          <div className={`strength-fill strength-${score}`} />
        </div>
      )}
      {generated && <p className="hint">{LABELS[score]}</p>}

      <label className="generator-slider">
        Tamanho: {length}
        <input
          type="range"
          min={8}
          max={32}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
        />
      </label>

      <div className="generator-checks">
        <label>
          <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} />
          Maiúsculas
        </label>
        <label>
          <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} />
          Números
        </label>
        <label>
          <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} />
          Símbolos
        </label>
      </div>

      <div className="generator-actions">
        <button type="button" onClick={handleGenerate}>🔄 Gerar outra</button>
        <button type="button" onClick={() => { onUse(generated); setOpen(false) }}>Usar esta</button>
      </div>
    </div>
  )
}
