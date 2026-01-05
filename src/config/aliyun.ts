export const aliyunSmsConfig = {
  accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID || '',
  accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET || '',
  region: process.env.ALIYUN_SMS_REGION || 'cn-hangzhou',
  signName: process.env.ALIYUN_SMS_SIGN_NAME || '',
  templateCode: process.env.ALIYUN_SMS_TEMPLATE_CODE || '',
};
export const aliyunOssConfig = {
  accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID || '',
  accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET || '',
  region: process.env.ALIYUN_OSS_REGION || 'oss-cn-hangzhou',
  bucket: process.env.ALIYUN_OSS_BUCKET || '',
  endpoint: process.env.ALIYUN_OSS_ENDPOINT || 
    `https://${process.env.ALIYUN_OSS_BUCKET}.${process.env.ALIYUN_OSS_REGION}.aliyuncs.com`,
  signatureExpire: 30 * 60, 
  maxFileSize: 500 * 1024 * 1024, 
  allowedFileTypes: ['video/mp4', 'application/x-mpegURL', 'video/MP2T', 'image/jpeg', 'image/png'],
};
export const validateAliyunConfig = (): void => {
  const requiredEnvVars = [
    'ALIYUN_ACCESS_KEY_ID',
    'ALIYUN_ACCESS_KEY_SECRET',
    'ALIYUN_SMS_SIGN_NAME',
    'ALIYUN_SMS_TEMPLATE_CODE',
    'ALIYUN_OSS_BUCKET',
  ];
  const missingVars = requiredEnvVars.filter(
    (varName: string) => !process.env[varName]
  );
  if (missingVars.length > 0) {
    console.error(' 阿里云配置缺失，请检查以下环境变量:');
    missingVars.forEach((varName: string) => {
      console.error(`   - ${varName}`);
    });
    console.error(' 提示: 请参考 .env.example 文件配置环境变量');
    if (process.env.NODE_ENV === 'production') {
      throw new Error('阿里云配置不完整，无法启动服务');
    }
  } else {
    console.log(' 阿里云配置验证通过');
  }
};
