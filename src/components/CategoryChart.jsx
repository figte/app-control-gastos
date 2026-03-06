import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { CATEGORIES, getCategoryById } from '../data/categories'
import styles from './CategoryChart.module.css'

const fmt = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const d = payload[0]
    return (
      <div className={styles.tooltip}>
        <strong>{d.name}</strong>
        <span>{fmt(d.value)}</span>
      </div>
    )
  }
  return null
}

export const CategoryChart = ({ expenses }) => {
  const expensesOnly = expenses.filter(e => !e.isIncome)

  const byCategory = expensesOnly.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount)
    return acc
  }, {})

  const data = Object.entries(byCategory)
    .map(([id, value]) => {
      const cat = getCategoryById(id)
      return { name: `${cat.icon} ${cat.label}`, value, color: cat.color }
    })
    .sort((a, b) => b.value - a.value)

  if (data.length === 0) {
    return (
      <div className={styles.empty}>
        <span>📊</span>
        <p>Sin datos de gastos aún</p>
      </div>
    )
  }

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Gastos por categoría</h2>
      <div className={styles.chartArea}>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className={styles.legend}>
        {data.map((d, i) => (
          <li key={i} className={styles.legendItem}>
            <span className={styles.dot} style={{ background: d.color }} />
            <span className={styles.catName}>{d.name}</span>
            <span className={styles.catAmt}>{fmt(d.value)}</span>
            <span className={styles.catPct}>
              {((d.value / total) * 100).toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
