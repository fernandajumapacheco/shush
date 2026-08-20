import { useState } from 'react'

export default function PasswordField({ value, onChange, placeholder, required, minLength }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="password-field">
      <input
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
      />
      <button
        type="button"
        className="toggle-visibility"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? 'Esconder senha' : 'Mostrar senha'}
      >
        {visible ? '👁️' : '🙈'}
      </button>
    </div>
  )
}
