import { useEffect, useState } from 'react'
import Link from 'next/link'
import * as XLSX from 'xlsx'

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
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

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

  function exportToExcel() {
    // Preparar datos de cabecera
    const headerData = orders.map((order) => ({
      'ID Pedido': order.id,
      'ID Local': order.id_local,
      'Local': order.local?.nombre,
      'Fecha Pedido': new Date(order.fecha).toLocaleDateString(),
      'Hora Pedido': order.horaPedido,
      'Cliente': order.nombreCliente,
      'Celular': order.celular,
      'Total': order.total.toFixed(2),
      'Estado': order.estado,
    }))

    // Preparar datos de detalle
    const detailData: any[] = []
    orders.forEach((order) => {
      order.detalles.forEach((detail) => {
        detailData.push({
          'ID Pedido': order.id,
          'Fecha': new Date(order.fecha).toLocaleDateString(),
          'Plato': detail.menu?.plato ?? detail.menuId,
          'Cantidad': detail.cantidad,
          'Precio': detail.precio.toFixed(2),
          'Comentarios': detail.comentarios || '',
        })
      })
    })

    // Crear workbook con dos hojas
    const wb = XLSX.utils.book_new()
    const wsHeaders = XLSX.utils.json_to_sheet(headerData)
    const wsDetails = XLSX.utils.json_to_sheet(detailData)

    XLSX.utils.book_append_sheet(wb, wsHeaders, 'Cabeceras')
    XLSX.utils.book_append_sheet(wb, wsDetails, 'Detalles')

    // Descargar archivo
    XLSX.writeFile(wb, `pedidos_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  const selectedOrder = orders.find((order) => order.id === selectedOrderId)

  return (
    <div className="container">
      <h1>Pedidos realizados</h1>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button className="btn" onClick={exportToExcel}>Exportar a Excel</button>
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
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={9}>No hay pedidos todavía.</td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                style={{
                  cursor: 'pointer',
                  background: selectedOrderId === order.id ? '#eef' : 'transparent',
                }}
              >
                <td>{order.id}</td>
                <td>{order.local?.nombre}</td>
                <td>{new Date(order.fecha).toLocaleDateString()}</td>
                <td>{order.horaPedido}</td>
                <td>{order.nombreCliente}</td>
                <td>{order.celular}</td>
                <td>{order.total.toFixed(2)}</td>
                <td>{order.estado}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedOrder && (
        <div style={{ marginTop: 24, padding: 16, border: '1px solid #ddd', background: '#fafafa' }}>
          <h2>Detalle del pedido #{selectedOrder.id}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginBottom: 16 }}>
            <div><strong>ID local</strong><div>{selectedOrder.local.id}</div></div>
            <div><strong>Fecha pedido</strong><div>{new Date(selectedOrder.fecha).toLocaleDateString()}</div></div>
            <div><strong>Hora pedido</strong><div>{selectedOrder.horaPedido}</div></div>
            <div><strong>Cliente</strong><div>{selectedOrder.nombreCliente}</div></div>
            <div><strong>Celular</strong><div>{selectedOrder.celular}</div></div>
            <div><strong>Total</strong><div>{selectedOrder.total.toFixed(2)}</div></div>
            <div><strong>Estado</strong><div>{selectedOrder.estado}</div></div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Fecha</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Plato</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Cantidad</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Precio</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Comentarios</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.detalles.map((detail) => (
                <tr key={detail.id}>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{new Date(selectedOrder.fecha).toLocaleDateString()}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{detail.menu?.plato ?? detail.menuId}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{detail.cantidad}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{detail.precio.toFixed(2)}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{detail.comentarios || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
