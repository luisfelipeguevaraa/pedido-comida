import { useEffect, useState } from 'react'
import Link from 'next/link'

type Menu = { id: number; fecha: string; plato: string }
type Local = { id: number; nombre: string }
type OrderDetail = { id: number; cantidad: number; precio: number; comentarios: string | null; menu: Menu }
type OrderHeader = {
  id: number
  fecha: string
  horaPedido: string
  nombreCliente: string
  celular: string
  total: number
  estado: string
  createdAt: string
  local: Local
  detalles: OrderDetail[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderHeader[]>([])

  useEffect(() => {
    fetchOrders()
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
            <th>ID</th>
            <th>Local</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Cliente</th>
            <th>Celular</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={9}>No hay pedidos todavía.</td>
            </tr>
          ) : (
            orders.map((order) => (
              <>
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.local?.nombre}</td>
                  <td>{new Date(order.fecha).toLocaleDateString()}</td>
                  <td>{order.horaPedido}</td>
                  <td>{order.nombreCliente}</td>
                  <td>{order.celular}</td>
                  <td>{order.total.toFixed(2)}</td>
                  <td>{order.estado}</td>
                  <td>
                    <Link href={`/orders/${order.id}/edit`} className="btn">Editar</Link>
                    <button className="btn danger" onClick={() => deleteOrder(order.id)} style={{ marginLeft: 8 }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
                <tr key={`details-${order.id}`}>
                  <td colSpan={9} style={{ padding: 0 }}>
                    <div style={{ padding: '8px 12px', background: '#f9f9f9', borderBottom: '1px solid #ddd' }}>
                      <strong>Detalles:</strong>
                      <table style={{ width: '100%', marginTop: 8, borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ border: '1px solid #ddd', padding: 6 }}>Menú</th>
                            <th style={{ border: '1px solid #ddd', padding: 6 }}>Cantidad</th>
                            <th style={{ border: '1px solid #ddd', padding: 6 }}>Precio</th>
                            <th style={{ border: '1px solid #ddd', padding: 6 }}>Comentarios</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.detalles.map((detail) => (
                            <tr key={detail.id}>
                              <td style={{ border: '1px solid #ddd', padding: 6 }}>{detail.menu?.plato ?? detail.menuId}</td>
                              <td style={{ border: '1px solid #ddd', padding: 6 }}>{detail.cantidad}</td>
                              <td style={{ border: '1px solid #ddd', padding: 6 }}>{detail.precio.toFixed(2)}</td>
                              <td style={{ border: '1px solid #ddd', padding: 6 }}>{detail.comentarios || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
