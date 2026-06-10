# Menus Next.js + Prisma + SQLite

Proyecto mínimo para administrar `menus` con Next.js, Prisma y SQLite.

Instalación y uso:

```bash
cd c:\DISCOD\proyectos\2026\fuentes\dev2
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Las rutas API están en `pages/api/menus` y `pages/api/orders`, y las páginas en `pages/menus` y `pages/orders`.
