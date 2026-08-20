export default function TokenItem({ entry, onDelete }) {
  return (
    <li className="token-item">
      <strong>{entry.site}</strong>
      <span className="token-value">{entry.senha}</span>
      <button onClick={() => onDelete(entry.id)}>Excluir</button>
    </li>
  )
}
