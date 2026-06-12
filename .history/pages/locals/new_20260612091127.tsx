import { FormEvent, useState } from 'react'
import { useRouter } from 'next/router'
import BackButton from '../../components/BackButton'

export default function NewLocal() {
  const [nombre, setNombre] = useState('')
  const [habilitado, setHabilitado] = useState(true)
  const router = useRouter()

  async function save(e: FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/locals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre, habilitado }) })
    if (res.ok) router.push('/locals')
  }

  return (
    <div className="container">
      <BackButton />
      <h1>Nuevo local</h1>
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
