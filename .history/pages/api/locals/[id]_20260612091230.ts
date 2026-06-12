import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'id requerido' })

  const localId = Number(id)
  if (Number.isNaN(localId)) return res.status(400).json({ error: 'id invalido' })

  if (req.method === 'GET') {
    const local = await prisma.local.findUnique({ where: { id: localId } })
    if (!local) return res.status(404).json({ error: 'no encontrado' })
    return res.status(200).json(local)
  }

  if (req.method === 'PUT') {
    const { nombre, habilitado } = req.body
    const updated = await prisma.local.update({ where: { id: localId }, data: { nombre, habilitado } })
    return res.status(200).json(updated)
  }

  if (req.method === 'DELETE') {
    await prisma.local.delete({ where: { id: localId } })
    return res.status(204).end()
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
