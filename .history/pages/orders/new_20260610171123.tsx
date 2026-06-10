import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

type Menu = { id: number; fecha: string; plato: string }

export default function NewOrder() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [lugarRecepcion, setLugarRecepcion] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/menus')
      .then((r) => r.json())
      .then(setMenus)
  }, [])

  function toggle(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedIds.length) {
      setMessage('Selecciona al menos un menú')
      return
    }
    if (!nombre || !telefono || !lugarRecepcion || cantidad < 1) {
      setMessage('Completa todos los campos correctamente')
      return
    }
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, telefono, lugarRecepcion, cantidad, menuIds: selectedIds }),
    })
    if (!res.ok) {
      const data = await res.json()
      setMessage(data.error || 'Error al crear pedido')
      return
    }
    router.push('/')
  }

  return (
    <div className="container">
      <h1>Nuevo pedido</h1>
      <form onSubmit={save}>
        <label>Nombre</label>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} />

        <label>Teléfono</label>
        <input value={telefono} onChange={(e) => setTelefono(e.target.value)} />

        <label>Lugar de recepción</label>
        <input value={lugarRecepcion} onChange={(e) => setLugarRecepcion(e.target.value)} />

        <label>Cantidad total</label>
        <input
          type="number"
          min={1}
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
        />

        <fieldset>
          <legend>Selecciona uno o varios menús</legend>
          {menus.length === 0 && <p>Cargando menús...</p>}
          {menus.map((menu) => (
            <label key={menu.id} style={{ display: 'block', marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={selectedIds.includes(menu.id)}
                onChange={() => toggle(menu.id)}
              />
              {' '}
              #{menu.id} - {new Date(menu.fecha).toLocaleString()} - {menu.plato}
            </label>
          ))}
        </fieldset>

        <div>
          <button className="btn" type="submit">Enviar pedido</button>
        </div>
        {message && <p style={{ color: 'red' }}>{message}</p>}
      </form>
    </div>
  )
}
