import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const locals = await prisma.local.findMany({ orderBy: { id: 'asc' } })
    return res.status(200).json(locals)
  }

  if (req.method === 'POST') {
    const { nombre, habilitado } = req.body
    if (!nombre) return res.status(400).json({ error: 'nombre es requerido' })
    const local = await prisma.local.create({ data: { nombre, habilitado: habilitado ?? true } })
    return res.status(201).json(local)
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
