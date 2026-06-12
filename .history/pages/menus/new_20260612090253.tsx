import { FormEvent, useState } from 'react'
import { useRouter } from 'next/router'
import BackButton from '../../components/BackButton'

export default function NewMenu() {
  const [fecha, setFecha] = useState('')
  const [plato, setPlato] = useState('')
  const router = useRouter()

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await fetch('/api/menus', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fecha, plato }) })
    router.push('/')
  }

  return (
    <div className="container">
      <BackButton />
      <h1>Nuevo menú</h1>
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
