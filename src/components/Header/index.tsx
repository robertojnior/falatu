import format from 'date-fns/format'
import enUS from 'date-fns/locale/en-US'

import styles from './styles.module.scss'

export function Header() {
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', { locale: enUS })

  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Falatu logo" />

      <p>The best for you to listen, always!</p>

      <span>{currentDate}</span>
    </header>
  )
}
