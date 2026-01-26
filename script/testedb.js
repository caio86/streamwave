import prisma from '../prisma/prisma.js';

async function testar() {
  const resultado = await prisma.$queryRaw`SELECT 1`;
  console.log('Conectou no banco:', resultado);
}

testar()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
