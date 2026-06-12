import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

type OrderDetailInput = {
  menuId: number
  cantidad: number
  precio: number
  comentarios?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const orders = await prisma.orderHeader.findMany({
      orderBy: { fecha: 'desc', horaPedido: 'desc' },
      include: {
        local: true,
        detalles: {
          include: { menu: true },
        },
      },
    })
    return res.status(200).json(orders)
  }

  if (req.method === 'POST') {
    const { id_local, fecha, horaPedido, nombreCliente, celular, estado, detalles } = req.body
    if (!id_local || !fecha || !horaPedido || !nombreCliente || !celular || !Array.isArray(detalles) || detalles.length === 0) {
      return res.status(400).json({ error: 'Todos los datos de cabecera y al menos un detalle son requeridos' })
    }

    const detalleItems = detalles as OrderDetailInput[]
    const total = detalleItems.reduce((sum, item) => sum + Number(item.precio) * Number(item.cantidad), 0)

    const order = await prisma.orderHeader.create({
      data: {
        id_local,
        fecha: new Date(fecha),
        horaPedido,
        nombreCliente,
        celular,
        estado,
        total,
        detalles: {
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

    return res.status(201).json(order)
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
