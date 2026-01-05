import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});
export const closePrisma = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log(' Prisma 连接已关闭');
  } catch (error) {
    console.error(' 关闭 Prisma 连接失败:', error);
  }
};
export default prisma;
