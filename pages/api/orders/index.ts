import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

type OrderData = {
  nombre: string
  telefono: string
  lugarRecepcion: string
  cantidad: number
  menuIds: number[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } })
    return res.status(200).json(orders)
  }

  if (req.method === 'POST') {
    const { nombre, telefono, lugarRecepcion, cantidad, menuIds } = req.body as OrderData
    if (!nombre || !telefono || !lugarRecepcion || !cantidad || !menuIds?.length) {
      return res.status(400).json({ error: 'Todos los campos son requeridos y debe seleccionar al menos un menú' })
    }

    const order = await prisma.order.create({
      data: {
        nombre,
        telefono,
        lugarRecepcion,
        cantidad,
        menuIds: JSON.stringify(menuIds),
      },
    })

    return res.status(201).json(order)
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
