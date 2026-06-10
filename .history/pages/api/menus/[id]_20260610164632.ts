import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const menuId = Number(id)
  if (Number.isNaN(menuId)) return res.status(400).json({ error: 'id inválido' })

  if (req.method === 'GET') {
    const menu = await prisma.menu.findUnique({ where: { id: menuId } })
    if (!menu) return res.status(404).json({ error: 'no encontrado' })
    return res.status(200).json(menu)
  }

  if (req.method === 'PUT') {
    const { fecha, plato } = req.body
    const menu = await prisma.menu.update({ where: { id: menuId }, data: { fecha: new Date(fecha), plato } })
    return res.status(200).json(menu)
  }

  if (req.method === 'DELETE') {
    await prisma.menu.delete({ where: { id: menuId } })
    return res.status(204).end()
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
