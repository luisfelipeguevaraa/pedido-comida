import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import BackButton from '../../../components/BackButton'

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

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await fetch(`/api/menus/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fecha, plato }) })
    router.push('/')
  }

  return (
    <div className="container">
      <BackButton />
      <h1>Editar menú</h1>
      <form onSubmit={save} style={{ maxWidth: 500 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Fecha</label>
          <input
            type="datetime-local"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Plato</label>
          <input
            value={plato}
            onChange={(e) => setPlato(e.target.value)}
            style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" type="submit">Guardar</button>
        </div>
      </form>
    </div>
  )
}
