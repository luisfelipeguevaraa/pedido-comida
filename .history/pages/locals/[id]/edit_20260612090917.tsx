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
      <form onSubmit={save}>
        <label>Nombre</label>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} />

        <label>
          <input type="checkbox" checked={habilitado} onChange={(e) => setHabilitado(e.target.checked)} /> Habilitado
        </label>

        <div>
          <button className="btn" type="submit">Guardar</button>
        </div>
      </form>
    </div>
  )
}
