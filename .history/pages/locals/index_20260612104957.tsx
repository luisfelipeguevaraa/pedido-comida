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
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <Link href="/locals/new" className="btn">Nuevo local</Link>
        <Link href="/" className="btn">Volver a menús</Link>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: 12, textAlign: 'left', fontWeight: 'bold' }}>ID</th>
            <th style={{ padding: 12, textAlign: 'left', fontWeight: 'bold' }}>Nombre</th>
            <th style={{ padding: 12, textAlign: 'left', fontWeight: 'bold' }}>Habilitado</th>
            <th style={{ padding: 12, textAlign: 'center', fontWeight: 'bold' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {locals.length === 0 ? (
            <tr><td colSpan={4} style={{ padding: 12, textAlign: 'center' }}>No hay registros.</td></tr>
          ) : (
            locals.map((l) => (
              <tr key={l.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 12 }}>{l.id}</td>
                <td style={{ padding: 12 }}>{l.nombre}</td>
                <td style={{ padding: 12 }}>{l.habilitado ? 'Sí' : 'No'}</td>
                <td style={{ padding: 12, textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <Link href={`/locals/${l.id}/edit`} className="btn" style={{ marginRight: 8 }}>Editar</Link>
                  <button className="btn danger" onClick={() => remove(l.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
