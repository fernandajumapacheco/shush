import { useState } from 'react'

export default function PasswordField({ value, onChange, placeholder, required }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="password-field">
      <input
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      <button
        type="button"
        className="toggle-visibility"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? 'Esconder senha' : 'Mostrar senha'}
      >
        {visible ? '🙈' : '👁️'}
      </button>
    </div>
  )
}
