import { useState } from 'react'
import PasswordField from './PasswordField'
import PasswordGenerator from './PasswordGenerator'
import { faviconUrl } from '../lib/favicon'

export const TIPOS = {
  senha: { label: 'Senha', placeholder: 'Senha' },
  token: { label: 'Token / Chave', placeholder: 'Valor do token' },
  seed: { label: 'Frase de recuperação', placeholder: 'Cole as palavras separadas por espaço' },
  outras: { label: 'Outras', placeholder: 'Senha' },
}

export default function AddEntryForm({ onAdd, onClose }) {
  const [tipo, setTipo] = useState(null)
  const [site, setSite] = useState('')
  const [login, setLogin] = useState('')
  const [nome, setNome] = useState('')
  const [pwd, setPwd] = useState('')

  function reset() {
    setTipo(null)
    setSite('')
    setLogin('')
    setNome('')
    setPwd('')
    onClose()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const success = await onAdd({ tipo, site, login, nome, pwd })
    if (success) reset()
  }

  if (!tipo) {
    return (
      <div className="add-form">
        <p className="hint">O que você quer guardar?</p>
        <div className="type-menu">
          {Object.entries(TIPOS).map(([key, { label }]) => (
            <button key={key} type="button" onClick={() => setTipo(key)}>
              {label}
            </button>
          ))}
        </div>
        <button type="button" className="link-button" onClick={reset}>Cancelar</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <p className="form-title">⭐ {TIPOS[tipo].label} <span className="mascot-small">🐸</span></p>

      {tipo === 'senha' && (
        <div className="site-field">
          {site.trim() && <img src={faviconUrl(site)} alt="" className="entry-favicon" />}
          <input placeholder="Site" value={site} onChange={(e) => setSite(e.target.value)} required />
        </div>
      )}

      {(tipo === 'senha' || tipo === 'outras') && (
        <input
          placeholder="Usuário/e-mail"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
      )}

      {(tipo === 'token' || tipo === 'seed') && (
        <input
          placeholder={tipo === 'token' ? 'Nome (ex: Token GitHub)' : 'Nome (ex: Carteira MetaMask)'}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      )}

      {tipo === 'seed' ? (
        <textarea
          placeholder={TIPOS[tipo].placeholder}
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          required
          rows={4}
          className="seed-textarea"
        />
      ) : (
        <>
          <PasswordField
            placeholder={TIPOS[tipo].placeholder}
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
          />
          {(tipo === 'senha' || tipo === 'outras') && (
            <PasswordGenerator onUse={setPwd} />
          )}
        </>
      )}

      <div className="add-form-actions">
        <button type="button" className="link-button" onClick={reset}>Cancelar</button>
        <button type="submit">🔑 Salvar</button>
      </div>
    </form>
  )
}
