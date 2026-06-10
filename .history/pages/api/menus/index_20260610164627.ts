import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const menus = await prisma.menu.findMany({ orderBy: { fecha: 'desc' } })
    return res.status(200).json(menus)
  }

  if (req.method === 'POST') {
    const { fecha, plato } = req.body
    if (!fecha || !plato) return res.status(400).json({ error: 'fecha y plato son requeridos' })
    const menu = await prisma.menu.create({ data: { fecha: new Date(fecha), plato } })
    return res.status(201).json(menu)
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
