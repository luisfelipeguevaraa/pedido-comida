import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import BackButton from '../../components/BackButton'

type Menu = { id: number; fecha: string; plato: string }
type Local = { id: number; nombre: string; habilitado: boolean }

type OrderDetailRow = {
  menuId: number
  cantidad: number
  precio: number
  comentarios: string
}

export default function NewOrder() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [locals, setLocals] = useState<Local[]>([])
  const [id_local, setIdLocal] = useState<number | ''>('')
  const [fecha, setFecha] = useState('')
  const [horaPedido, setHoraPedido] = useState('')
  const [nombreCliente, setNombreCliente] = useState('')
  const [celular, setCelular] = useState('')
  const [estado, setEstado] = useState('Pendiente')
  const [details, setDetails] = useState<OrderDetailRow[]>([
    { menuId: 0, cantidad: 1, precio: 0, comentarios: '' },
  ])
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/menus').then((r) => r.json()).then(setMenus)
    fetch('/api/locals').then((r) => r.json()).then(setLocals)
  }, [])

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

    const res = await fetch('/api/orders', {
      method: 'POST',
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
      setMessage(data.error || 'Error al crear pedido')
      return
    }

    router.push('/orders')
  }

  return (
    <div className="container">
      <BackButton />
      <h1>Nuevo pedido</h1>
      <form onSubmit={save}>
        <label>Local</label>
        <select value={id_local} onChange={(e) => setIdLocal(Number(e.target.value))}>
          <option value="">Selecciona un local</option>
          {locals.map((local) => (
            <option key={local.id} value={local.id}>
              {local.nombre}
            </option>
          ))}
        </select>

        <label>Fecha</label>
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />

        <label>Hora de pedido</label>
        <input type="time" value={horaPedido} onChange={(e) => setHoraPedido(e.target.value)} />

        <label>Nombre cliente</label>
        <input value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} />

        <label>Celular</label>
        <input value={celular} onChange={(e) => setCelular(e.target.value)} />

        <label>Estado</label>
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="Pendiente">Pendiente</option>
          <option value="Confirmado">Confirmado</option>
          <option value="Entregado">Entregado</option>
        </select>

        <fieldset>
          <legend>Detalle del pedido</legend>
          {details.map((detail, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: 12, marginBottom: 12 }}>
              <label>Menú</label>
              <select
                value={detail.menuId}
                onChange={(e) => updateDetail(index, { menuId: Number(e.target.value) })}
              >
                <option value="">Selecciona menú</option>
                {menus.map((menu) => (
                  <option key={menu.id} value={menu.id}>
                    {menu.plato} ({new Date(menu.fecha).toLocaleDateString()})
                  </option>
                ))}
              </select>

              <label>Cantidad</label>
              <input
                type="number"
                min={1}
                value={detail.cantidad}
                onChange={(e) => updateDetail(index, { cantidad: Number(e.target.value) })}
              />

              <label>Precio</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={detail.precio}
                onChange={(e) => updateDetail(index, { precio: Number(e.target.value) })}
              />

              <label>Comentarios</label>
              <input
                value={detail.comentarios}
                onChange={(e) => updateDetail(index, { comentarios: e.target.value })}
              />

              <button type="button" className="btn danger" onClick={() => removeDetail(index)}>
                Eliminar detalle
              </button>
            </div>
          ))}
          <button type="button" className="btn" onClick={addDetail}>
            Agregar detalle
          </button>
        </fieldset>

        <p>Total: {total.toFixed(2)}</p>

        <div>
          <button className="btn" type="submit">Guardar pedido</button>
        </div>
        {message && <p style={{ color: 'red' }}>{message}</p>}
      </form>
    </div>
  )
}
