import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Pasamos la URL directamente al instanciar para obligar a Next.js
// a leer la variable de entorno de DigitalOcean en vivo (Run time).
const prisma = global.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma
