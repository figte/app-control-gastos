import { useState } from 'react'
import { CATEGORIES, getCategoryById } from '../data/categories'
import styles from './ExpenseList.module.css'

const fmt = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

export const ExpenseList = ({ expenses, onDelete }) => {
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  const filtered = expenses.filter(e => {
    const matchSearch = e.description.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'all' || e.category === filterCat
    return matchSearch && matchCat
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleDelete = (id) => {
    if (confirm('¿Eliminar este registro?')) onDelete(id)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Movimientos ({filtered.length})</h2>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className={styles.search}
          />
          <select
            value={filterCat}
            onChange={e => { setFilterCat(e.target.value); setPage(1) }}
            className={styles.select}
          >
            <option value="all">Todas</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {paginated.length === 0 ? (
        <div className={styles.empty}>
          <span>📋</span>
          <p>No hay movimientos registrados</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {paginated.map(expense => {
            const cat = getCategoryById(expense.category)
            return (
              <li key={expense.id} className={styles.item}>
                <span
                  className={styles.catDot}
                  style={{ background: cat.color }}
                  title={cat.label}
                >
                  {cat.icon}
                </span>
                <div className={styles.info}>
                  <span className={styles.desc}>{expense.description}</span>
                  <span className={styles.meta}>{cat.label} · {expense.date}</span>
                </div>
                <span className={`${styles.amount} ${expense.isIncome ? styles.inc : styles.exp}`}>
                  {expense.isIncome ? '+' : '-'}{fmt(expense.amount)}
                </span>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(expense.id)}
                  title="Eliminar"
                >
                  ✕
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
          <span>{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
        </div>
      )}
    </div>
  )
}
