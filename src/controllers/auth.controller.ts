import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../types';

interface InitiateAuthRequest {
    Body: {
        userId: string;
    };
}

interface VerifyAuthRequest {
    Body: AuthRequest;
}

export const authController = {
    async initiateAuth(
        request: FastifyRequest<InitiateAuthRequest>,
        reply: FastifyReply
    ) {
        try {
            const { userId } = request.body;
            const challenge = await authService.initiateAuth(userId);

            return reply.send({ challenge });
        } catch (error: any) {
            request.log.error(error);
            return reply.code(500).send({ error: error.message });
        }
    },

    async verifyAuth(
        request: FastifyRequest<VerifyAuthRequest>,
        reply: FastifyReply
    ) {
        try {
            const authRequest = request.body;
            const result = await authService.verifyAuth(authRequest);

            return reply.send(result);
        } catch (error: any) {
            request.log.error(error);
            return reply.code(401).send({ error: error.message });
        }
    },

    async logout(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        return reply.send({ success: true });
    }
};