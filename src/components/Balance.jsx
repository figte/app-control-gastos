import styles from './Balance.module.css'

const fmt = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

export const Balance = ({ balance }) => {
  const isPositive = balance.total >= 0

  return (
    <div className={styles.grid}>
      <div className={`${styles.card} ${styles.income}`}>
        <span className={styles.icon}>📈</span>
        <div>
          <p className={styles.label}>Ingresos</p>
          <p className={styles.amount}>{fmt(balance.income)}</p>
        </div>
      </div>

      <div className={`${styles.card} ${styles.expenses}`}>
        <span className={styles.icon}>📉</span>
        <div>
          <p className={styles.label}>Gastos</p>
          <p className={styles.amount}>{fmt(balance.expenses)}</p>
        </div>
      </div>

      <div className={`${styles.card} ${styles.total} ${isPositive ? styles.positive : styles.negative}`}>
        <span className={styles.icon}>{isPositive ? '✅' : '⚠️'}</span>
        <div>
          <p className={styles.label}>Balance</p>
          <p className={styles.amount}>{fmt(balance.total)}</p>
        </div>
      </div>
    </div>
  )
}
