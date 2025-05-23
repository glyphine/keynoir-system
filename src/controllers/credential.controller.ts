import { FastifyRequest, FastifyReply } from 'fastify';
import { credentialService } from '../services/credential.service';
import { Credential } from '../types';

interface RegisterCredentialsRequest {
    Body: {
        userId: string;
        credentials: Credential[];
    };
}

interface UpdateCredentialsRequest {
    Body: {
        credentials: Credential[];
    };
}

export const credentialController = {
    async registerCredentials(
        request: FastifyRequest<RegisterCredentialsRequest>,
        reply: FastifyReply
    ) {
        try {
            const { userId, credentials } = request.body;
            const result = await credentialService.registerCredentials(userId, credentials);

            return reply.code(201).send(result);
        } catch (error: any) {
            request.log.error(error);
            return reply.code(500).send({ error: error.message });
        }
    },

    async updateCredentials(
        request: FastifyRequest<UpdateCredentialsRequest>,
        reply: FastifyReply
    ) {
        try {
            const userId = (request as any).user.id;
            const { credentials } = request.body;

            const result = await credentialService.updateCredentials(userId, credentials);

            return reply.send(result);
        } catch (error: any) {
            request.log.error(error);
            return reply.code(500).send({ error: error.message });
        }
    },

    async getCredentialStatus(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const userId = (request as any).user.id;
            const status = await credentialService.getCredentialStatus(userId);

            return reply.send(status);
        } catch (error: any) {
            request.log.error(error);
            return reply.code(500).send({ error: error.message });
        }
    }
};