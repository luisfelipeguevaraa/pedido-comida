import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import BackButton from '../../../components/BackButton'

export default function EditLocal() {
  const router = useRouter()
  const { id } = router.query
  const [nombre, setNombre] = useState('')
  const [habilitado, setHabilitado] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/locals/${id}`).then((r) => r.json()).then((data) => {
      setNombre(data.nombre)
      setHabilitado(!!data.habilitado)
    })
  }, [id])

  async function save(e: FormEvent) {
    e.preventDefault()
    await fetch(`/api/locals/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre, habilitado }) })
    router.push('/locals')
  }

  return (
    <div className="container">
      <BackButton />
      <h1>Editar local</h1>
      <form onSubmit={save} style={{ maxWidth: 500 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Nombre</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={habilitado}
              onChange={(e) => setHabilitado(e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            <span>Habilitado</span>
          </label>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" type="submit">Guardar</button>
        </div>
      </form>
    </div>
  )
}
