import { useState, useRef, useEffect } from 'react'
import styles from './Toolbar.module.css'

const CSV_FORMAT = `Formato CSV esperado (UTF-8):
Fecha,Descripcion,Categoria,Monto,Tipo

Columnas:
• Fecha     → YYYY-MM-DD  (ej: 2026-03-11)
• Descripcion → texto libre
• Categoria → alimentacion | transporte |
              salud | entretenimiento |
              educacion | hogar | ropa |
              servicios | ingresos | otro
• Monto     → número positivo  (ej: 15000)
• Tipo      → Ingreso | Gasto`

export const Toolbar = ({ onExportCSV, onImportCSV, onClearAll, count }) => {
  const [open, setOpen] = useState(false)
  const [showFormat, setShowFormat] = useState(false)
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
        <button className={styles.btn} onClick={() => setShowFormat(v => !v)} title="Ver formato CSV">
          ℹ️ Formato
        </button>
        <button className={`${styles.btn} ${styles.danger}`} onClick={onClearAll} disabled={count === 0}>
          🗑️ Limpiar todo
        </button>
      </div>

      {showFormat && (
        <div className={styles.formatPanel}>
          <pre className={styles.formatCode}>{CSV_FORMAT}</pre>
          <button className={styles.closeFormat} onClick={() => setShowFormat(false)}>✕ Cerrar</button>
        </div>
      )}

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
              className={styles.dropItem}
              onClick={() => { setShowFormat(v => !v); setOpen(false) }}
            >
              <span>ℹ️</span> Formato CSV
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

        {showFormat && (
          <div className={styles.formatPanel}>
            <pre className={styles.formatCode}>{CSV_FORMAT}</pre>
            <button className={styles.closeFormat} onClick={() => setShowFormat(false)}>✕ Cerrar</button>
          </div>
        )}
      </div>
    </>
  )
}
