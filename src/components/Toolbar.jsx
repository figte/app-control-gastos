import { useState, useRef, useEffect } from 'react'
import styles from './Toolbar.module.css'

export const Toolbar = ({ onExportCSV, onImportCSV, onClearAll, count }) => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (file) { onImportCSV(file); setOpen(false) }
    e.target.value = ''
  }

  // Close menu on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', handler)
    return () => document.removeEventListener('pointerdown', handler)
  }, [open])

  return (
    <>
      {/* Desktop: full button bar */}
      <div className={styles.bar}>
        <label className={styles.btn} title="Importar CSV">
          📂 Importar CSV
          <input type="file" accept=".csv" onChange={handleImport} hidden />
        </label>
        <button className={styles.btn} onClick={onExportCSV} disabled={count === 0}>
          💾 Exportar CSV
        </button>
        <button className={`${styles.btn} ${styles.danger}`} onClick={onClearAll} disabled={count === 0}>
          🗑️ Limpiar todo
        </button>
      </div>

      {/* Mobile: hamburger + dropdown */}
      <div className={styles.mobileMenu} ref={menuRef}>
        <button
          className={styles.menuBtn}
          onClick={() => setOpen(v => !v)}
          aria-label="Menú de opciones"
          aria-expanded={open}
        >
          <span className={styles.menuDot} />
          <span className={styles.menuDot} />
          <span className={styles.menuDot} />
        </button>

        {open && (
          <div className={styles.dropdown}>
            <label className={styles.dropItem}>
              <span>📂</span> Importar CSV
              <input type="file" accept=".csv" onChange={handleImport} hidden />
            </label>
            <button
              className={styles.dropItem}
              onClick={() => { onExportCSV(); setOpen(false) }}
              disabled={count === 0}
            >
              <span>💾</span> Exportar CSV
            </button>
            <button
              className={`${styles.dropItem} ${styles.dropDanger}`}
              onClick={() => { onClearAll(); setOpen(false) }}
              disabled={count === 0}
            >
              <span>🗑️</span> Limpiar todo
            </button>
          </div>
        )}
      </div>
    </>
  )
}
