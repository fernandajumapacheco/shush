export default function SeedItem({ entry, onDelete }) {
  const words = entry.senha.trim().split(/\s+/)

  return (
    <li className="seed-item">
      <div className="seed-item-header">
        <strong>{entry.site}</strong>
        <span className="entry-count">{words.length} palavras</span>
        <button onClick={() => onDelete(entry.id)}>Excluir</button>
      </div>
      <ol className="seed-words">
        {words.map((word, i) => (
          <li key={i}>{word}</li>
        ))}
      </ol>
    </li>
  )
}
