import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import BackButton from '../../../components/BackButton'

type Menu = { id: number; fecha: string; plato: string }
type Local = { id: number; nombre: string; habilitado: boolean }
type OrderDetailRow = {
  menuId: number
  cantidad: number
  precio: number
  comentarios: string
}

type OrderHeader = {
  id: number
  id_local: number
  fecha: string
  horaPedido: string
  nombreCliente: string
  celular: string
  estado: string
  detalles: Array<{ id: number; menuId: number; cantidad: number; precio: number; comentarios: string | null }>
}

export default function EditOrder() {
  const router = useRouter()
  const { id } = router.query
  const [menus, setMenus] = useState<Menu[]>([])
  const [locals, setLocals] = useState<Local[]>([])
  const [order, setOrder] = useState<OrderHeader | null>(null)
  const [id_local, setIdLocal] = useState<number | ''>('')
  const [fecha, setFecha] = useState('')
  const [horaPedido, setHoraPedido] = useState('')
  const [nombreCliente, setNombreCliente] = useState('')
  const [celular, setCelular] = useState('')
  const [estado, setEstado] = useState('Pendiente')
  const [details, setDetails] = useState<OrderDetailRow[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/menus').then((r) => r.json()).then(setMenus)
    fetch('/api/locals').then((r) => r.json()).then(setLocals)
  }, [])

  useEffect(() => {
    if (!id) return
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data)
        setIdLocal(data.id_local)
        setFecha(data.fecha.split('T')[0])
        setHoraPedido(data.horaPedido)
        setNombreCliente(data.nombreCliente)
        setCelular(data.celular)
        setEstado(data.estado)
        setDetails(
          data.detalles.map((detail: any) => ({
            menuId: detail.menuId,
            cantidad: detail.cantidad,
            precio: detail.precio,
            comentarios: detail.comentarios || '',
          }))
        )
      })
  }, [id])

  const total = useMemo(
    () => details.reduce((sum, item) => sum + item.cantidad * item.precio, 0),
    [details]
  )

  function updateDetail(index: number, partial: Partial<OrderDetailRow>) {
    setDetails((prev) => prev.map((row, idx) => (idx === index ? { ...row, ...partial } : row)))
  }

  function addDetail() {
    setDetails((prev) => [...prev, { menuId: menus[0]?.id ?? 0, cantidad: 1, precio: 0, comentarios: '' }])
  }

  function removeDetail(index: number) {
    setDetails((prev) => prev.filter((_, idx) => idx !== index))
  }

  async function save(e: FormEvent) {
    e.preventDefault()
    if (!id_local || !fecha || !horaPedido || !nombreCliente || !celular || details.length === 0) {
      setMessage('Completa todos los datos y agrega al menos un detalle')
      return
    }
    if (details.some((item) => !item.menuId || item.cantidad < 1 || item.precio <= 0)) {
      setMessage('Cada detalle debe tener menú, cantidad y precio válidos')
      return
    }

    const res = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_local,
        fecha,
        horaPedido,
        nombreCliente,
        celular,
        estado,
        detalles: details,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setMessage(data.error || 'Error al actualizar pedido')
      return
    }

    router.push('/orders')
  }

  return (
    <div className="container">
      <BackButton />
      <h1>Editar pedido</h1>
      <form onSubmit={save}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Local</label>
            <select
              value={id_local}
              onChange={(e) => setIdLocal(Number(e.target.value))}
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box' }}
            >
              <option value="">Selecciona un local</option>
              {locals.map((local) => (
                <option key={local.id} value={local.id}>
                  {local.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Hora de pedido</label>
            <input
              type="time"
              value={horaPedido}
              onChange={(e) => setHoraPedido(e.target.value)}
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Nombre cliente</label>
            <input
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Celular</label>
            <input
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box' }}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Entregado">Entregado</option>
            </select>
          </div>
        </div>

        <fieldset>
          <legend>Detalle del pedido</legend>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
            <thead>
              <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: 10, textAlign: 'left', fontWeight: 'bold' }}>Menú</th>
                <th style={{ padding: 10, textAlign: 'center', fontWeight: 'bold' }}>Cantidad</th>
                <th style={{ padding: 10, textAlign: 'center', fontWeight: 'bold' }}>Precio</th>
                <th style={{ padding: 10, textAlign: 'left', fontWeight: 'bold' }}>Comentarios</th>
                <th style={{ padding: 10, textAlign: 'center', fontWeight: 'bold' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {details.map((detail, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee', background: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: 10, verticalAlign: 'middle' }}>
                    <select
                      value={detail.menuId}
                      onChange={(e) => updateDetail(index, { menuId: Number(e.target.value) })}
                      style={{ width: '100%', padding: 6, border: '1px solid #ddd', borderRadius: 4 }}
                    >
                      <option value="">Selecciona menú</option>
                      {menus.map((menu) => (
                        <option key={menu.id} value={menu.id}>
                          {menu.plato} ({new Date(menu.fecha).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: 10, textAlign: 'center' }}>
                    <input
                      type="number"
                      min={1}
                      value={detail.cantidad}
                      onChange={(e) => updateDetail(index, { cantidad: Number(e.target.value) })}
                      style={{ width: 60, padding: 6, border: '1px solid #ddd', borderRadius: 4, textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: 10, textAlign: 'center' }}>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={detail.precio}
                      onChange={(e) => updateDetail(index, { precio: Number(e.target.value) })}
                      style={{ width: 80, padding: 6, border: '1px solid #ddd', borderRadius: 4, textAlign: 'right' }}
                    />
                  </td>
                  <td style={{ padding: 10 }}>
                    <input
                      type="text"
                      value={detail.comentarios}
                      onChange={(e) => updateDetail(index, { comentarios: e.target.value })}
                      style={{ width: '100%', padding: 6, border: '1px solid #ddd', borderRadius: 4 }}
                      placeholder="Ej: sin sal, sin cebolla..."
                    />
                  </td>
                  <td style={{ padding: 10, textAlign: 'center' }}>
                    <button
                      type="button"
                      className="btn danger"
                      onClick={() => removeDetail(index)}
                      style={{ padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="btn" onClick={addDetail} style={{ marginBottom: 16 }}>
            + Agregar detalle
          </button>
        </fieldset>

        <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 6, marginBottom: 16, border: '1px solid #eee' }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Resumen del pedido</h3>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
            Total: ${total.toFixed(2)}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" type="submit">Guardar pedido</button>
        </div>
        {message && <p style={{ color: 'red' }}>{message}</p>}
      </form>
    </div>
  )
}
