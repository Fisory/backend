import dotenv from 'dotenv';
import app from './app';
import { validateAliyunConfig } from '@/config/aliyun';
import { validateJwtConfig } from '@/config/jwt';
import { closeRedis } from '@/config/redis';
import { closePrisma } from '@/prisma/client';
dotenv.config();
const validateConfig = (): void => {
  console.log('🔍 验证配置...');
  try {
    validateAliyunConfig();
    validateJwtConfig();
    console.log('✅ 配置验证通过');
  } catch (error) {
    console.error('❌ 配置验证失败:', error);
    process.exit(1);
  }
};
const startServer = (): void => {
  const PORT = process.env.PORT || 3000;
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const server = app.listen(PORT, () => {
    console.log('');
    console.log('🚀 ========================================');
    console.log('🚀 视频平台后端服务启动成功!');
    console.log('🚀 ========================================');
    console.log(`📍 环境: ${NODE_ENV}`);
    console.log(`📍 端口: ${PORT}`);
    console.log(`📍 地址: http://localhost:${PORT}`);
    console.log(`📍 健康检查: http://localhost:${PORT}/api/health`);
    console.log('🚀 ========================================');
    console.log('');
  });
  const gracefulShutdown = async (signal: string): Promise<void> => {
    console.log('');
    console.log(`  收到 ${signal} 信号，开始优雅关闭...`);
    server.close(async () => {
      console.log(' HTTP 服务器已关闭');
      try {
        await closePrisma();
        await closeRedis();
        console.log(' 所有连接已关闭');
        console.log(' 服务已安全退出');
        process.exit(0);
      } catch (error) {
        console.error(' 关闭连接时发生错误:', error);
        process.exit(1);
      }
    });
    setTimeout(() => {
      console.error(' 优雅关闭超时，强制退出');
      process.exit(1);
    }, 10000);
  };
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('uncaughtException', (error: Error) => {
    console.error(' 未捕获的异常:', error);
    gracefulShutdown('uncaughtException');
  });
  process.on('unhandledRejection', (reason: any) => {
    console.error(' 未处理的 Promise 拒绝:', reason);
    gracefulShutdown('unhandledRejection');
  });
};
const bootstrap = (): void => {
  try {
    validateConfig();
    startServer();
  } catch (error) {
    console.error(' 服务启动失败:', error);
    process.exit(1);
  }
};
bootstrap();
