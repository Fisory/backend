import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from '@/routes';
import { errorResponse, StatusCode } from '@/utils/response';
const app: Application = express();
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api', routes);
app.use((req: Request, res: Response) => {
  return errorResponse(
    res,
    `路由不存在: ${req.method} ${req.path}`,
    StatusCode.INVALID_PARAMS,
    404
  );
});
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(' 全局错误:', err);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
  return errorResponse(
    res,
    process.env.NODE_ENV === 'production' 
      ? '服务器内部错误' 
      : err.message,
    StatusCode.SERVER_ERROR,
    500
  );
});
export default app;
