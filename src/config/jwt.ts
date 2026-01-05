export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  algorithm: 'HS256' as const,
  issuer: 'video-platform',
  audience: 'video-platform-users',
};
export interface JwtPayload {
  userId: string | number;  
  iat?: number;             
  exp?: number;             
  iss?: string;             
  aud?: string;             
}
export const validateJwtConfig = (): void => {
  if (!process.env.JWT_SECRET) {
    console.warn('  警告: JWT_SECRET 未设置，使用默认值 (不安全)');
    console.warn(' 提示: 请在 .env 文件中设置 JWT_SECRET');
    if (process.env.NODE_ENV === 'production') {
      throw new Error('生产环境必须设置 JWT_SECRET');
    }
  }
  if (process.env.NODE_ENV === 'production' && jwtConfig.secret.length < 32) {
    throw new Error('生产环境 JWT_SECRET 长度必须至少 32 字符');
  }
  console.log(' JWT 配置验证通过');
};
