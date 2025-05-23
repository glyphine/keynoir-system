import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    try {
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.code(401).send({ error: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.jwtSecret) as { id: string };

        // Attach user to the request
        (request as any).user = { id: decoded.id };
    } catch (error) {
        return reply.code(401).send({ error: 'Invalid or expired token' });
    }
}