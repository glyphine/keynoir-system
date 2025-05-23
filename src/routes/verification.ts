import { FastifyInstance } from 'fastify';
import { verificationController } from '../controllers/verification.controller';
import { authenticate } from '../middlewares/auth';

export async function verificationRoutes(fastify: FastifyInstance) {
    // Generate a challenge for proof generation
    fastify.get('/challenge', {
        handler: verificationController.generateChallenge
    });

    // Verify a specific credential without full authentication
    fastify.post('/credential', {
        handler: verificationController.verifyCredential
    });
}