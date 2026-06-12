import { useEffect, useState } from 'react'
import Link from 'next/link'
import BackButton from '../../components/BackButton'

type Local = { id: number; nombre: string; habilitado: boolean }

export default function LocalsPage() {
  const [locals, setLocals] = useState<Local[]>([])

  useEffect(() => {
    fetch('/api/locals').then((r) => r.json()).then(setLocals)
  }, [])

  async function remove(id: number) {
    if (!confirm('Eliminar registro?')) return
    const res = await fetch(`/api/locals/${id}`, { method: 'DELETE' })
    if (res.ok) setLocals((c) => c.filter((x) => x.id !== id))
  }

  return (
    <div className="container">
      <BackButton />
      <h1>Locales</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <Link href="/locals/new" className="btn">Nuevo local</Link>
        <Link href="/" className="btn">Volver a menús</Link>
      </div>
      <table>
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Habilitado</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {locals.length === 0 ? (
            <tr><td colSpan={4}>No hay registros.</td></tr>
          ) : (
            locals.map((l) => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.nombre}</td>
                <td>{l.habilitado ? 'Sí' : 'No'}</td>
                <td>
                  <Link href={`/locals/${l.id}/edit`} className="btn">Editar</Link>
                  <button className="btn danger" onClick={() => remove(l.id)} style={{ marginLeft: 8 }}>Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
