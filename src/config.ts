import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    host: process.env.HOST || '0.0.0.0',
    corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'],
    jwtSecret: process.env.JWT_SECRET || 'keynoir-dev-secret',
    jwtExpiresIn: '24h',
    masterCredentialStorePath: process.env.MASTER_CREDENTIAL_STORE_PATH || './data/master-credentials'
};