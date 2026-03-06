import { useState } from 'react'
import { CATEGORIES } from '../data/categories'
import styles from './ExpenseForm.module.css'

const today = () => new Date().toISOString().split('T')[0]

export const ExpenseForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'alimentacion',
    date: today(),
    isIncome: false,
  })
  const [error, setError] = useState('')

  const set = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.description.trim()) return setError('Escribe una descripción')
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      return setError('Ingresa un monto válido')
    setError('')
    const cat = CATEGORIES.find(c => c.id === form.category)
    onAdd({
      ...form,
      amount: parseFloat(form.amount),
      isIncome: cat?.isIncome || form.isIncome,
    })
    setForm(prev => ({ ...prev, description: '', amount: '' }))
  }

  const selectedCat = CATEGORIES.find(c => c.id === form.category)

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.title}>Agregar movimiento</h2>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="description">Descripción</label>
          <input
            id="description"
            type="text"
            placeholder="Ej: Almuerzo, Gasolina..."
            value={form.description}
            onChange={set('description')}
            maxLength={80}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="amount">Monto</label>
          <input
            id="amount"
            type="number"
            placeholder="0"
            value={form.amount}
            onChange={set('amount')}
            min="0"
            step="any"
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="category">Categoría</label>
          <select id="category" value={form.category} onChange={set('category')}>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="date">Fecha</label>
          <input
            id="date"
            type="date"
            value={form.date}
            onChange={set('date')}
          />
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button
        type="submit"
        className={styles.btn}
        style={{ background: selectedCat?.color || 'var(--primary)' }}
      >
        {selectedCat?.icon} Agregar {selectedCat?.isIncome ? 'ingreso' : 'gasto'}
      </button>
    </form>
  )
}
