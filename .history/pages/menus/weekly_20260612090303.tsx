import { useEffect, useState } from 'react'
import BackButton from '../../components/BackButton'

type Menu = {
  id: number
  fecha: string
  plato: string
}

function getMonday(d: Date) {
  const date = new Date(d)
  const day = date.getDay()
  const diff = (day === 0 ? -6 : 1) - day // adjust when day is Sunday
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}

function formatDate(d: Date) {
  return d.toISOString().split('T')[0]
}

export default function WeeklyMenus() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [weekStart, setWeekStart] = useState<Date>(getMonday(new Date()))

  useEffect(() => {
    setLoading(true)
    fetch('/api/menus')
      .then((r) => r.json())
      .then((data) => {
        setMenus(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(String(err))
        setLoading(false)
      })
  }, [])

  const dates = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })

  const groups: Record<string, string[]> = {}
  for (const d of dates) groups[formatDate(d)] = []

  for (const m of menus) {
    // m.fecha may be ISO string
    const fecha = m.fecha ? new Date(m.fecha) : null
    if (!fecha) continue
    const key = formatDate(fecha)
    if (key in groups) groups[key].push(m.plato)
  }

  const maxRows = Math.max(0, ...Object.values(groups).map((a) => a.length))

  function prevWeek() {
    const d = new Date(weekStart)
    d.setDate(d.getDate() - 7)
    setWeekStart(getMonday(d))
  }

  function nextWeek() {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 7)
    setWeekStart(getMonday(d))
  }

  return (
    <div style={{ padding: 20 }}>
      <BackButton />
      <h1>Vista semanal de menús</h1>
      <div style={{ marginBottom: 12 }}>
        <button onClick={prevWeek}>Anterior</button>
        <button onClick={nextWeek} style={{ marginLeft: 8 }}>
          Siguiente
        </button>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((name, idx) => (
                <th
                  key={name}
                  style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}
                >
                  <div>{name}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{formatDate(dates[idx])}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxRows || 1 }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {dates.map((d) => {
                  const key = formatDate(d)
                  const val = groups[key][rowIdx] || ''
                  return (
                    <td key={key + rowIdx} style={{ border: '1px solid #eee', padding: '8px' }}>
                      {val}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
