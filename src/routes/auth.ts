import { FastifyInstance } from 'fastify';
import { authController } from '../controllers/auth.controller';

export async function authRoutes(fastify: FastifyInstance) {
    // Initiate authentication process
    fastify.post('/initiate', {
        handler: authController.initiateAuth
    });

    // Complete authentication with proof
    fastify.post('/verify', {
        handler: authController.verifyAuth
    });

    // Logout
    fastify.post('/logout', {
        handler: authController.logout
    });
}