import styles from './Toolbar.module.css'

export const Toolbar = ({ onExportCSV, onImportCSV, onClearAll, count }) => {
  const handleImport = (e) => {
    const file = e.target.files[0]
    if (file) onImportCSV(file)
    e.target.value = ''
  }

  return (
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
  )
}
