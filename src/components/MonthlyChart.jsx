import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'
import styles from './MonthlyChart.module.css'

const fmt = (n) =>
  new Intl.NumberFormat('es-CO', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

export const MonthlyChart = ({ expenses }) => {
  const byMonth = expenses.reduce((acc, e) => {
    if (!e.date) return acc
    const [year, month] = e.date.split('-')
    const key = `${year}-${month}`
    if (!acc[key]) acc[key] = { key, label: `${MONTHS[parseInt(month)-1]} ${year}`, income: 0, expenses: 0 }
    const amount = parseFloat(e.amount) || 0
    if (e.isIncome) acc[key].income += amount
    else acc[key].expenses += amount
    return acc
  }, {})

  const data = Object.values(byMonth)
    .sort((a, b) => a.key.localeCompare(b.key))
    .slice(-6)

  if (data.length === 0) {
    return null
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Últimos 6 meses</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
          <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} width={52} />
          <Tooltip
            formatter={(v, name) =>
              [new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v), name]
            }
          />
          <Legend wrapperStyle={{ fontSize: '0.85rem' }} />
          <Bar dataKey="income" name="Ingresos" fill="#10b981" radius={[4,4,0,0]} />
          <Bar dataKey="expenses" name="Gastos" fill="#ef4444" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
