import { useState, useEffect, useRef } from 'react'
import { useExpenses } from './hooks/useExpenses'
import { Balance } from './components/Balance'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { CategoryChart } from './components/CategoryChart'
import { MonthlyChart } from './components/MonthlyChart'
import { Toolbar } from './components/Toolbar'
import styles from './App.module.css'

const TABS = [
  { label: 'Resumen',   icon: '📊' },
  { label: 'Agregar',   icon: '➕' },
  { label: 'Historial', icon: '📋' },
]

export default function App() {
  const [tab, setTab] = useState(0)
  const [toast, setToast] = useState(null)
  const [installPrompt, setInstallPrompt] = useState(null)
  const installPromptRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      installPromptRef.current = e
      setInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setInstallPrompt(null))
    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    const prompt = installPromptRef.current
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') {
      setInstallPrompt(null)
      installPromptRef.current = null
    }
  }

  const {
    expenses, addExpense, deleteExpense,
    clearAll, exportCSV, importCSV, balance,
  } = useExpenses()

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleAdd = (expense) => {
    addExpense(expense)
    showToast(`${expense.isIncome ? 'Ingreso' : 'Gasto'} agregado correctamente`)
    setTab(0)
  }

  const handleClear = () => {
    if (confirm('¿Eliminar TODOS los registros? Esta acción no se puede deshacer.')) {
      clearAll()
      showToast('Todos los registros eliminados', 'warning')
    }
  }

  const handleImport = async (file) => {
    try {
      const n = await importCSV(file)
      showToast(`${n} registros importados`)
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <span>💸</span>
            <h1>Control de Gastos</h1>
          </div>
          <div className={styles.headerRight}>
            {installPrompt && (
              <button className={styles.installBtn} onClick={handleInstall}>
                📲 Instalar app
              </button>
            )}
            <Toolbar
            count={expenses.length}
            onExportCSV={exportCSV}
            onImportCSV={handleImport}
            onClearAll={handleClear}
            />
          </div>
        </div>
      </header>

      {/* Top nav — desktop only */}
      <nav className={styles.topNav}>
        {TABS.map((t, i) => (
          <button
            key={t.label}
            className={`${styles.topNavBtn} ${tab === i ? styles.active : ''}`}
            onClick={() => setTab(i)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </nav>

      <main className={styles.main}>
        {tab === 0 && (
          <div className={styles.grid}>
            <div className={styles.full}>
              <Balance balance={balance} />
            </div>
            <CategoryChart expenses={expenses} />
            <MonthlyChart expenses={expenses} />
            <div className={styles.full}>
              <ExpenseList
                expenses={expenses.slice(0, 5)}
                onDelete={deleteExpense}
              />
            </div>
          </div>
        )}

        {tab === 1 && (
          <div className={styles.formWrap}>
            <ExpenseForm onAdd={handleAdd} />
          </div>
        )}

        {tab === 2 && (
          <ExpenseList expenses={expenses} onDelete={deleteExpense} />
        )}
      </main>

      {/* Bottom nav — mobile only */}
      <nav className={styles.bottomNav} aria-label="Navegación principal">
        {TABS.map((t, i) => (
          <button
            key={t.label}
            className={`${styles.bottomNavBtn} ${tab === i ? styles.bottomActive : ''}`}
            onClick={() => setTab(i)}
          >
            <span className={styles.bottomIcon}>{t.icon}</span>
            <span className={styles.bottomLabel}>{t.label}</span>
          </button>
        ))}
      </nav>

      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
