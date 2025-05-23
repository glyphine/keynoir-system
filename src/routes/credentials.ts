import { FastifyInstance } from 'fastify';
import { credentialController } from '../controllers/credential.controller';
import { authenticate } from '../middlewares/auth';

export async function credentialRoutes(fastify: FastifyInstance) {
    // Register credentials for a user
    fastify.post('/register', {
        handler: credentialController.registerCredentials
    });

    // Update user credentials
    fastify.put('/', {
        preHandler: [authenticate],
        handler: credentialController.updateCredentials
    });

    // Get credential status (without exposing actual credentials)
    fastify.get('/status', {
        preHandler: [authenticate],
        handler: credentialController.getCredentialStatus
    });
}