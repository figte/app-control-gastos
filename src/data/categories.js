export const CATEGORIES = [
  { id: 'alimentacion',   label: 'Alimentación',    icon: '🍔', color: '#f59e0b' },
  { id: 'transporte',     label: 'Transporte',       icon: '🚗', color: '#3b82f6' },
  { id: 'salud',          label: 'Salud',            icon: '🏥', color: '#ef4444' },
  { id: 'educacion',      label: 'Educación',        icon: '📚', color: '#8b5cf6' },
  { id: 'entretenimiento',label: 'Entretenimiento',  icon: '🎮', color: '#ec4899' },
  { id: 'hogar',          label: 'Hogar',            icon: '🏠', color: '#14b8a6' },
  { id: 'ropa',           label: 'Ropa',             icon: '👗', color: '#f97316' },
  { id: 'tecnologia',     label: 'Tecnología',       icon: '💻', color: '#6366f1' },
  { id: 'viajes',         label: 'Viajes',           icon: '✈️', color: '#0ea5e9' },
  { id: 'ingresos',       label: 'Ingresos',         icon: '💰', color: '#10b981', isIncome: true },
  { id: 'otros',          label: 'Otros',            icon: '📦', color: '#94a3b8' },
]

export const getCategoryById = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1]
