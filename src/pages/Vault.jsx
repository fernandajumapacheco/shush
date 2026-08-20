import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { encrypt, decrypt } from '../lib/crypto'

export default function Vault({ session, masterPassword }) {
  const [entries, setEntries] = useState([])
  const [site, setSite] = useState('')
  const [login, setLogin] = useState('')
  const [pwd, setPwd] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEntries()
  }, [])

  async function loadEntries() {
    setLoading(true)
    const { data, error } = await supabase
      .from('senhas')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    const decrypted = await Promise.all(
      data.map(async (row) => ({
        id: row.id,
        site: row.site,
        login: row.login,
        senha: await decrypt(
          { cipherText: row.senha_cifrada, salt: row.salt, iv: row.iv },
          masterPassword
        ),
      }))
    )

    setEntries(decrypted)
    setLoading(false)
  }

  async function handleAdd(e) {
    e.preventDefault()
    const { cipherText, salt, iv } = await encrypt(pwd, masterPassword)

    const { error } = await supabase.from('senhas').insert({
      user_id: session.user.id,
      site,
      login,
      senha_cifrada: cipherText,
      salt,
      iv,
    })

    if (error) {
      console.error(error)
      return
    }

    setSite('')
    setLogin('')
    setPwd('')
    loadEntries()
  }

  async function handleDelete(id) {
    await supabase.from('senhas').delete().eq('id', id)
    loadEntries()
  }

  return (
    <div className="vault-screen">
      <header>
        <h1>Shush</h1>
        <button onClick={() => supabase.auth.signOut()}>Sair</button>
      </header>

      <form onSubmit={handleAdd} className="add-form">
        <input placeholder="Site" value={site} onChange={(e) => setSite(e.target.value)} required />
        <input placeholder="Usuário/e-mail" value={login} onChange={(e) => setLogin(e.target.value)} required />
        <input
          type="password"
          placeholder="Senha"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          required
        />
        <button type="submit">Salvar</button>
      </form>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul className="entry-list">
          {entries.map((entry) => (
            <li key={entry.id}>
              <strong>{entry.site}</strong>
              <span>{entry.login}</span>
              <span>{entry.senha}</span>
              <button onClick={() => handleDelete(entry.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
