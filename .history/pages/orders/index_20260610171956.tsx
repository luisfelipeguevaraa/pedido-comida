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
    fetch('/api/orders').then((r) => r.json()).then(setOrders)
    fetch('/api/menus').then((r) => r.json()).then(setMenus)
  }, [])

  const rows: OrderRow[] = orders.flatMap((order) => {
    let ids: number[] = []
    try {
      ids = JSON.parse(order.menuIds)
    } catch {
      ids = []
    }

    return ids.length > 0
      ? ids.map((menuId) => {
          const menu = menus.find((m) => m.id === menuId)
          return {
            ...order,
            menuPlato: menu?.plato ?? 'Desconocido',
            menuFecha: menu?.fecha ?? '',
          }
        })
      : [{ ...order, menuPlato: 'Sin platos', menuFecha: '' }]
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
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6}>No hay pedidos todavía.</td>
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
