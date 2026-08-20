import { useEffect } from 'react'

const TIMEOUT_MS = 10 * 60 * 1000 // 10 minutos sem uso

// Desconecta automaticamente após um período sem interação,
// reduzindo o risco de alguém acessar o cofre num aparelho esquecido aberto.
export function useIdleLogout(onTimeout) {
  useEffect(() => {
    let timer = setTimeout(onTimeout, TIMEOUT_MS)

    function reset() {
      clearTimeout(timer)
      timer = setTimeout(onTimeout, TIMEOUT_MS)
    }

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    events.forEach((event) => window.addEventListener(event, reset))

    return () => {
      clearTimeout(timer)
      events.forEach((event) => window.removeEventListener(event, reset))
    }
  }, [onTimeout])
}
