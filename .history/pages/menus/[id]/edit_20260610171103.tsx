import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function EditMenu() {
  const router = useRouter()
  const { id } = router.query
  const [fecha, setFecha] = useState('')
  const [plato, setPlato] = useState('')

  useEffect(() => {
    if (!id) return
    fetch(`/api/menus/${id}`).then((r) => r.json()).then((data) => {
      setFecha(new Date(data.fecha).toISOString().slice(0,16))
      setPlato(data.plato)
    })
  }, [id])

  async function save(e) {
    e.preventDefault()
    await fetch(`/api/menus/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fecha, plato }) })
    router.push('/')
  }

  return (
    <div className="container">
      <h1>Editar menú</h1>
      <form onSubmit={save}>
        <label>Fecha</label>
        <input type="datetime-local" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        <label>Plato</label>
        <input value={plato} onChange={(e) => setPlato(e.target.value)} />
        <div>
          <button className="btn" type="submit">Guardar</button>
        </div>
      </form>
    </div>
  )
}
