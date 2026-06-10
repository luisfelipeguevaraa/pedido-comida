import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const orderId = Number(id)
  if (Number.isNaN(orderId)) return res.status(400).json({ error: 'id inválido' })

  if (req.method === 'DELETE') {
    await prisma.order.delete({ where: { id: orderId } })
    return res.status(204).end()
  }

  res.setHeader('Allow', ['DELETE'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
