import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { encrypt, decrypt } from '../lib/crypto'
import { useIdleLogout } from '../lib/useIdleLogout'
import EntryGroup from '../components/EntryGroup'
import TokenItem from '../components/TokenItem'
import SeedItem from '../components/SeedItem'
import MfaSetup from '../components/MfaSetup'
import AddEntryForm from '../components/AddEntryForm'

const OUTRAS = 'Outras'

export default function Vault({ session, masterPassword }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showMfaSetup, setShowMfaSetup] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')

  useIdleLogout(() => supabase.auth.signOut())

  useEffect(() => {
    loadEntries()
  }, [])

  useEffect(() => {
    if (!savedMessage) return
    const timer = setTimeout(() => setSavedMessage(''), 3000)
    return () => clearTimeout(timer)
  }, [savedMessage])

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
        tipo: row.tipo,
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

  async function handleAdd({ tipo, site, login, nome, pwd }) {
    const { cipherText, salt, iv } = await encrypt(pwd, masterPassword)
    const tipoSalvo = tipo === 'outras' ? 'senha' : tipo

    const { error } = await supabase.from('senhas').insert({
      user_id: session.user.id,
      tipo: tipoSalvo,
      site: tipo === 'senha' ? site.trim() || null : tipo === 'outras' ? null : nome.trim(),
      login: tipo === 'senha' || tipo === 'outras' ? login : null,
      senha_cifrada: cipherText,
      salt,
      iv,
    })

    if (error) {
      console.error(error)
      setSavedMessage('Erro ao salvar. Tente novamente.')
      return
    }

    setSavedMessage('Salvo com sucesso!')
    loadEntries()
  }

  async function handleDelete(id) {
    await supabase.from('senhas').delete().eq('id', id)
    loadEntries()
  }

  async function handleUpdate(id, { login, senha }) {
    const { cipherText, salt, iv } = await encrypt(senha, masterPassword)
    await supabase
      .from('senhas')
      .update({ login, senha_cifrada: cipherText, salt, iv })
      .eq('id', id)
    loadEntries()
  }

  const senhas = useMemo(() => entries.filter((e) => e.tipo === 'senha' || !e.tipo), [entries])
  const tokens = useMemo(() => entries.filter((e) => e.tipo === 'token'), [entries])
  const seeds = useMemo(() => entries.filter((e) => e.tipo === 'seed'), [entries])

  const groups = useMemo(() => {
    const map = new Map()
    for (const entry of senhas) {
      const key = entry.site?.trim() || OUTRAS
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(entry)
    }

    const outras = map.get(OUTRAS)
    map.delete(OUTRAS)

    const sorted = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
    if (outras) sorted.push([OUTRAS, outras])

    return sorted
  }, [senhas])

  return (
    <div className="vault-screen">
      <header>
        <h1>Shush</h1>
        <div className="header-actions">
          <button onClick={() => setShowMfaSetup(true)}>Segurança</button>
          <button onClick={() => supabase.auth.signOut()}>Sair</button>
        </div>
      </header>

      {showMfaSetup && (
        <div className="modal-overlay" onClick={() => setShowMfaSetup(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <MfaSetup onClose={() => setShowMfaSetup(false)} />
          </div>
        </div>
      )}

      <AddEntryForm onAdd={handleAdd} savedMessage={savedMessage} />

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <ul className="entry-list">
            {groups.map(([groupSite, items]) => (
              <EntryGroup
                key={groupSite}
                site={groupSite}
                items={items}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </ul>

          {tokens.length > 0 && (
            <>
              <h2 className="section-title">Tokens e chaves</h2>
              <ul className="entry-list">
                {tokens.map((entry) => (
                  <TokenItem key={entry.id} entry={entry} onDelete={handleDelete} />
                ))}
              </ul>
            </>
          )}

          {seeds.length > 0 && (
            <>
              <h2 className="section-title">Frases de recuperação</h2>
              <ul className="entry-list">
                {seeds.map((entry) => (
                  <SeedItem key={entry.id} entry={entry} onDelete={handleDelete} />
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  )
}
