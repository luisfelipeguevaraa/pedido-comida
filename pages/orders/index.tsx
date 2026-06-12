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
      'ID Local': order.local?.id,
      'Local': order.local?.nombre,
      'Fecha Pedido': order.fecha.slice(0, 10),
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
          'Fecha': order.fecha.slice(0, 10),
          'Plato': detail.menu?.plato ?? '',
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
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <button className="btn" onClick={exportToExcel}>📊 Exportar a Excel</button>
        <Link href="/orders/new" className="btn">Nuevo pedido</Link>
        <Link href="/" className="btn">Volver a menús</Link>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
          <thead>
            <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: 12, textAlign: 'left', fontWeight: 'bold' }}>ID</th>
              <th style={{ padding: 12, textAlign: 'left', fontWeight: 'bold' }}>Local</th>
              <th style={{ padding: 12, textAlign: 'left', fontWeight: 'bold' }}>Fecha</th>
              <th style={{ padding: 12, textAlign: 'left', fontWeight: 'bold' }}>Hora</th>
              <th style={{ padding: 12, textAlign: 'left', fontWeight: 'bold' }}>Cliente</th>
              <th style={{ padding: 12, textAlign: 'left', fontWeight: 'bold' }}>Celular</th>
              <th style={{ padding: 12, textAlign: 'right', fontWeight: 'bold' }}>Total</th>
              <th style={{ padding: 12, textAlign: 'left', fontWeight: 'bold' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: 12, textAlign: 'center', color: '#999' }}>No hay pedidos todavía.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  style={{
                    cursor: 'pointer',
                    background: selectedOrderId === order.id ? '#eef' : 'transparent',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <td style={{ padding: 12 }}>{order.id}</td>
                  <td style={{ padding: 12 }}>{order.local?.nombre}</td>
                  <td style={{ padding: 12 }}>{order.fecha.slice(0, 10)}</td>
                  <td style={{ padding: 12 }}>{order.horaPedido}</td>
                  <td style={{ padding: 12 }}>{order.nombreCliente}</td>
                  <td style={{ padding: 12 }}>{order.celular}</td>
                  <td style={{ padding: 12, textAlign: 'right', fontWeight: 500 }}>${order.total.toFixed(2)}</td>
                  <td style={{ padding: 12 }}>{order.estado}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div style={{ marginTop: 24, padding: 20, border: '1px solid #ddd', background: '#fafafa', borderRadius: 6 }}>
          <h2 style={{ marginTop: 0 }}>Detalle del pedido #{selectedOrder.id}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 20 }}>
            <div>
              <strong style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 4 }}>ID local</strong>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{selectedOrder.local.id}</div>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 4 }}>Fecha pedido</strong>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{selectedOrder.fecha.slice(0, 10)}</div>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 4 }}>Hora pedido</strong>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{selectedOrder.horaPedido}</div>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 4 }}>Cliente</strong>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{selectedOrder.nombreCliente}</div>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 4 }}>Celular</strong>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{selectedOrder.celular}</div>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 4 }}>Total</strong>
              <div style={{ fontSize: 16, fontWeight: 'bold', color: '#2196F3' }}>${selectedOrder.total.toFixed(2)}</div>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 4 }}>Estado</strong>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{selectedOrder.estado}</div>
            </div>
          </div>

          <div style={{ overflowX: 'auto', marginTop: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                  <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left', fontWeight: 'bold' }}>Fecha</th>
                  <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left', fontWeight: 'bold' }}>Plato</th>
                  <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'center', fontWeight: 'bold' }}>Cantidad</th>
                  <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'right', fontWeight: 'bold' }}>Precio</th>
                  <th style={{ border: '1px solid #ddd', padding: 10, textAlign: 'left', fontWeight: 'bold' }}>Comentarios</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.detalles.map((detail) => (
                  <tr key={detail.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ border: '1px solid #ddd', padding: 10 }}>{selectedOrder.fecha.slice(0, 10)}</td>
                    <td style={{ border: '1px solid #ddd', padding: 10 }}>{detail.menu?.plato ?? ''}</td>
                    <td style={{ border: '1px solid #ddd', padding: 10, textAlign: 'center' }}>{detail.cantidad}</td>
                    <td style={{ border: '1px solid #ddd', padding: 10, textAlign: 'right' }}>${detail.precio.toFixed(2)}</td>
                    <td style={{ border: '1px solid #ddd', padding: 10 }}>{detail.comentarios || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
