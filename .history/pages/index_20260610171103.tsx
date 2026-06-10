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
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Link href="/menus/new" className="btn">Nuevo menú</Link>
        <Link href="/orders/new" className="btn">Tomar pedido</Link>
      </div>
      <table>
        <thead>
          <tr><th>ID</th><th>Fecha</th><th>Plato</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {menus.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td><ClientDate iso={m.fecha} /></td>
              <td>{m.plato}</td>
              <td>
                <Link href={`/menus/${m.id}/edit`} className="btn">Editar</Link>
                <button className="btn danger" onClick={() => del(m.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
