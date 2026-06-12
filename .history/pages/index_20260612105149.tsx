import Link from 'next/link'
import { useEffect, useState } from 'react'

type Menu = { id: number; fecha: string; plato: string }

function ClientDate({ iso }: { iso: string }) {
  const [text, setText] = useState<string>('')
  useEffect(() => {
    // format only on client to avoid SSR/CSR mismatch
    try {
      setText(new Date(iso).toLocaleString())
    } catch (e) {
      setText(iso)
    }
  }, [iso])
  return <span>{text}</span>
}

export default function Home() {
  const [menus, setMenus] = useState<Menu[]>([])

  useEffect(() => {
    fetch('/api/menus')
      .then((r) => r.json())
      .then(setMenus)
  }, [])

  async function del(id: number) {
    if (!confirm('Eliminar menú?')) return
    await fetch(`/api/menus/${id}`, { method: 'DELETE' })
    setMenus((m) => m.filter((x) => x.id !== id))
  }

  return (
    <div className="container">
      <h1>Menus</h1>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <Link href="/menus/new" className="btn">Nuevo menú</Link>
        <Link href="/menus/weekly" className="btn">Vista semanal</Link>
        <Link href="/locals" className="btn">Locales</Link>
        <Link href="/orders/new" className="btn">Tomar pedido</Link>
        <Link href="/orders" className="btn">Pedidos realizados</Link>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: 12, textAlign: 'left', fontWeight: 'bold' }}>ID</th>
            <th style={{ padding: 12, textAlign: 'left', fontWeight: 'bold' }}>Fecha</th>
            <th style={{ padding: 12, textAlign: 'left', fontWeight: 'bold' }}>Plato</th>
            <th style={{ padding: 12, textAlign: 'center', fontWeight: 'bold' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((m) => (
            <tr key={m.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 12 }}>{m.id}</td>
              <td style={{ padding: 12 }}><ClientDate iso={m.fecha} /></td>
              <td style={{ padding: 12 }}>{m.plato}</td>
              <td style={{ padding: 12, textAlign: 'center', whiteSpace: 'nowrap' }}>
                <Link href={`/menus/${m.id}/edit`} className="btn" style={{ marginRight: 8 }}>Editar</Link>
                <button className="btn danger" onClick={() => del(m.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
