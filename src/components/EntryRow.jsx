import { useState } from 'react'
import PasswordField from './PasswordField'
import PasswordGenerator from './PasswordGenerator'

export default function EntryRow({ entry, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [login, setLogin] = useState(entry.login || '')
  const [senha, setSenha] = useState(entry.senha)

  async function handleSave() {
    await onUpdate(entry.id, { login, senha })
    setEditing(false)
  }

  if (editing) {
    return (
      <li className="entry-row editing">
        <input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Usuário/e-mail" />
        <PasswordField value={senha} onChange={(e) => setSenha(e.target.value)} />
        <PasswordGenerator onUse={setSenha} />
        <div className="entry-row-actions">
          <button type="button" className="link-button" onClick={() => setEditing(false)}>Cancelar</button>
          <button type="button" onClick={handleSave}>Salvar</button>
        </div>
      </li>
    )
  }

  return (
    <li className="entry-row">
      <span>{entry.login}</span>
      <span>{entry.senha}</span>
      <div className="entry-row-actions">
        <button onClick={() => setEditing(true)}>✏️ Editar</button>
        <button onClick={() => onDelete(entry.id)}>Excluir</button>
      </div>
    </li>
  )
}
