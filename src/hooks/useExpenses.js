import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'control-gastos-data'

// Properly handles quoted fields that may contain commas
function parseCSVLine(line) {
  const fields = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { field += '"'; i++ }
      else if (ch === '"') { inQuotes = false }
      else { field += ch }
    } else {
      if (ch === '"') { inQuotes = true }
      else if (ch === ',') { fields.push(field); field = '' }
      else { field += ch }
    }
  }
  fields.push(field)
  return fields
}

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveToStorage = (expenses) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
}

export const useExpenses = () => {
  const [expenses, setExpenses] = useState(loadFromStorage)

  useEffect(() => {
    saveToStorage(expenses)
  }, [expenses])

  const addExpense = useCallback((expense) => {
    const newExpense = {
      ...expense,
      id: crypto.randomUUID(),
      date: expense.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    }
    setExpenses(prev => [newExpense, ...prev])
  }, [])

  const deleteExpense = useCallback((id) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
  }, [])

  const updateExpense = useCallback((id, updates) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
  }, [])

  const clearAll = useCallback(() => {
    setExpenses([])
  }, [])

  const exportCSV = useCallback(() => {
    if (expenses.length === 0) return
    // ASCII-only headers → guaranteed to display correctly in any spreadsheet app
    const headers = ['Fecha', 'Descripcion', 'Categoria', 'Monto', 'Tipo']
    const rows = expenses.map(e => [
      e.date,
      `"${e.description.replace(/"/g, '""')}"`,
      e.category,
      e.amount,
      e.isIncome ? 'Ingreso' : 'Gasto',
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\r\n')
    // Explicit UTF-8 BOM bytes for maximum spreadsheet compatibility
    const encoder = new TextEncoder()
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF])
    const content = encoder.encode(csv)
    const blob = new Blob([bom, content], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gastos-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [expenses])

  const importCSV = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          // Strip UTF-8 BOM if present
          const text = e.target.result.replace(/^\uFEFF/, '')
          const lines = text.trim().split(/\r?\n/)
          const imported = lines.slice(1).map(line => {
            const [date, description, category, amount, tipo] = parseCSVLine(line)
            return {
              id: crypto.randomUUID(),
              date: date?.trim(),
              description: description?.trim(),
              category: category?.trim(),
              amount: parseFloat(amount),
              isIncome: tipo?.trim() === 'Ingreso',
              createdAt: new Date().toISOString(),
            }
          }).filter(e => e.date && e.description && !isNaN(e.amount))
          setExpenses(prev => [...imported, ...prev])
          resolve(imported.length)
        } catch {
          reject(new Error('Archivo CSV inválido'))
        }
      }
      reader.onerror = () => reject(new Error('Error al leer el archivo'))
      reader.readAsText(file, 'UTF-8')
    })
  }, [])

  const balance = expenses.reduce((acc, e) => {
    const amount = parseFloat(e.amount) || 0
    if (e.isIncome) {
      acc.income += amount
    } else {
      acc.expenses += amount
    }
    return acc
  }, { income: 0, expenses: 0 })

  balance.total = balance.income - balance.expenses

  return {
    expenses,
    addExpense,
    deleteExpense,
    updateExpense,
    clearAll,
    exportCSV,
    importCSV,
    balance,
  }
}
