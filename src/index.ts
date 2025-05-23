import Fastify from 'fastify';
import cors from '@fastify/cors';
import { credentialRoutes } from './routes/credentials';
import { authRoutes } from './routes/auth';
import { verificationRoutes } from './routes/verification';
import { config } from './config';

const server = Fastify({
    logger: true
});

// Register plugins
server.register(cors, {
    origin: config.corsOrigins,
    credentials: true
});

// Register routes
server.register(credentialRoutes, { prefix: '/api/credentials' });
server.register(authRoutes, { prefix: '/api/auth' });
server.register(verificationRoutes, { prefix: '/api/verification' });

// Health check endpoint
server.get('/health', async () => {
    return { status: 'ok' };
});

// Start server
const start = async () => {
    try {
        await server.listen({ port: config.port, host: config.host });
        server.log.info(`Server listening on ${config.host}:${config.port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();