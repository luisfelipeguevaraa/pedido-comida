import { useEffect, useState } from 'react'
import Link from 'next/link'

type Menu = { id: number; fecha: string; plato: string }
type Order = {
  id: number
  nombre: string
  telefono: string
  lugarRecepcion: string
  cantidad: number
  menuIds: string
  createdAt: string
}

type OrderRow = Order & { menuPlato: string; menuFecha: string }

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [menus, setMenus] = useState<Menu[]>([])

  useEffect(() => {
    fetchOrders()
    fetch('/api/menus').then((r) => r.json()).then(setMenus)
  }, [])

  async function fetchOrders() {
    const res = await fetch('/api/orders')
    const data = await res.json()
    setOrders(data)
  }

  async function deleteOrder(id: number) {
    if (!confirm('Eliminar este pedido?')) return
    const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setOrders((current) => current.filter((order) => order.id !== id))
    }
  }

  const rows: OrderRow[] = orders.flatMap((order) => {
    let ids: number[] = []
    try {
      ids = JSON.parse(order.menuIds)
    } catch {
      ids = []
    }

    return ids.length > 0
      ? ids.map((menuId, idx) => {
          const menu = menus.find((m) => m.id === menuId)
          return {
            ...order,
            menuPlato: menu?.plato ?? 'Desconocido',
            menuFecha: menu?.fecha ?? '',
            index: idx,
          } as OrderRow & { index: number }
        })
      : [{ ...order, menuPlato: 'Sin platos', menuFecha: '', index: 0 } as OrderRow & { index: number }]
  })

  return (
    <div className="container">
      <h1>Pedidos realizados</h1>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <Link href="/orders/new" className="btn">Nuevo pedido</Link>
        <Link href="/" className="btn">Volver a menús</Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Fecha</th>
            <th>Lugar de recepción</th>
            <th>Cantidad</th>
            <th>Plato</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7}>No hay pedidos todavía.</td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={`${row.id}-${index}`}>
                <td>{row.nombre}</td>
                <td>{row.telefono}</td>
                <td>{new Date(row.createdAt).toLocaleString()}</td>
                <td>{row.lugarRecepcion}</td>
                <td>{row.cantidad}</td>
                <td>{row.menuPlato}</td>
                <td>
                  {index === 0 ? (
                    <button className="btn danger" onClick={() => deleteOrder(row.id)}>
                      Eliminar
                    </button>
                  ) : null}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
