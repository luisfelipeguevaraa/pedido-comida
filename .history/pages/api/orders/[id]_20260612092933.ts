import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

type OrderDetailInput = {
  menuId: number
  cantidad: number
  precio: number
  comentarios?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const orderId = Number(id)
  if (Number.isNaN(orderId)) return res.status(400).json({ error: 'id inválido' })

  if (req.method === 'GET') {
    const order = await prisma.orderHeader.findUnique({
      where: { id: orderId },
      include: {
        local: true,
        detalles: { include: { menu: true } },
      },
    })
    if (!order) return res.status(404).json({ error: 'Pedido no encontrado' })
    return res.status(200).json(order)
  }

  if (req.method === 'PUT') {
    const { id_local, fecha, horaPedido, nombreCliente, celular, estado, detalles } = req.body
    if (!id_local || !fecha || !horaPedido || !nombreCliente || !celular || !Array.isArray(detalles) || detalles.length === 0) {
      return res.status(400).json({ error: 'Todos los datos de cabecera y al menos un detalle son requeridos' })
    }

    const detalleItems = detalles as OrderDetailInput[]
    const total = detalleItems.reduce((sum, item) => sum + Number(item.precio) * Number(item.cantidad), 0)

    const updated = await prisma.orderHeader.update({
      where: { id: orderId },
      data: {
        id_local,
        fecha: new Date(fecha),
        horaPedido,
        nombreCliente,
        celular,
        estado,
        total,
        detalles: {
          deleteMany: {},
          create: detalleItems.map((item) => ({
            menuId: item.menuId,
            cantidad: item.cantidad,
            precio: item.precio,
            comentarios: item.comentarios || undefined,
          })),
        },
      },
      include: {
        local: true,
        detalles: { include: { menu: true } },
      },
    })

    return res.status(200).json(updated)
  }

  if (req.method === 'DELETE') {
    await prisma.orderHeader.delete({ where: { id: orderId } })
    return res.status(204).end()
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
