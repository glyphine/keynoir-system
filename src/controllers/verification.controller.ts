import { FastifyRequest, FastifyReply } from 'fastify';
import { verificationService } from '../services/verification.service';

interface VerifyCredentialRequest {
    Body: {
        userId: string;
        credential: {
            type: string;
            proof: any;
        };
    };
}

export const verificationController = {
    async generateChallenge(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const challenge = verificationService.generateChallenge();

            return reply.send({ challenge });
        } catch (error: any) {
            request.log.error(error);
            return reply.code(500).send({ error: error.message });
        }
    },

    async verifyCredential(
        request: FastifyRequest<VerifyCredentialRequest>,
        reply: FastifyReply
    ) {
        try {
            const { userId, credential } = request.body;
            const result = await verificationService.verifyCredential(userId, credential);

            return reply.send(result);
        } catch (error: any) {
            request.log.error(error);
            return reply.code(401).send({ error: error.message });
        }
    }
};