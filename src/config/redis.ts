import Redis from 'ioredis';
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 3000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: false,
});
redisClient.on('connect', () => {
  console.log(' Redis 连接成功');
  console.log(` 连接地址: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
  console.log(` 数据库编号: ${process.env.REDIS_DB || 0}`);
});
redisClient.on('ready', () => {
  console.log(' Redis 已就绪，可以执行命令');
});
redisClient.on('error', (err: Error) => {
  console.error(' Redis 连接错误:', err.message);
  console.error(' 错误详情:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });
  if (err.message.includes('ECONNREFUSED')) {
    console.error(' 提示: 请检查 Redis 服务是否启动 (docker-compose up -d redis)');
  } else if (err.message.includes('NOAUTH')) {
    console.error(' 提示: 请检查 REDIS_PASSWORD 环境变量是否正确');
  }
});
redisClient.on('reconnecting', (delay: number) => {
  console.warn(`  Redis 正在重连... (延迟: ${delay}ms)`);
});
redisClient.on('close', () => {
  console.warn(' Redis 连接已关闭');
});
export const closeRedis = async (): Promise<void> => {
  try {
    await redisClient.quit();
    console.log(' Redis 连接已优雅关闭');
  } catch (error) {
    console.error(' 关闭 Redis 连接失败:', error);
  }
};
export default redisClient;
