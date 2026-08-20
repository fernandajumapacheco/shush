import { useState } from 'react'
import { faviconUrl } from '../lib/favicon'
import EntryRow from './EntryRow'

export default function EntryGroup({ site, items, onDelete, onUpdate }) {
  const [open, setOpen] = useState(false)
  const icon = site === 'Outras' ? null : faviconUrl(site)

  return (
    <li className="entry-group">
      <button className="entry-group-header" onClick={() => setOpen(!open)}>
        <span className={`chevron ${open ? 'open' : ''}`}>▶</span>
        {icon && (
          <img
            src={icon}
            alt=""
            className="entry-favicon"
            onError={(e) => { e.target.style.visibility = 'hidden' }}
          />
        )}
        <strong>{site}</strong>
        <span className="entry-count">{items.length}</span>
      </button>

      {open && (
        <ul className="entry-sublist">
          {items.map((entry) => (
            <EntryRow key={entry.id} entry={entry} onDelete={onDelete} onUpdate={onUpdate} />
          ))}
        </ul>
      )}
    </li>
  )
}
