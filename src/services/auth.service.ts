import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import { config } from '../config';
import { AuthRequest, AuthResponse, MasterCredential } from '../types';
import { verifyProof } from '../utils/zero-knowledge-proof';

type Secret = string | Buffer | { key: string; passphrase: string };

export const authService = {
    async initiateAuth(userId: string) {
        // Generate a random challenge for the authentication
        const challenge = Buffer.from(Math.random().toString(36).substring(2)).toString('base64');

        // In real implementation, you woud store this challenge associated with the user
        // for a short period of time to verify that the proof uses this challenge

        return challenge;
    },

    async verifyAuth(authRequest: AuthRequest): Promise<AuthResponse> {
        try {
            const { userId, credential, proof } = authRequest;

            if (!proof) {
                throw new Error('Proof is required for authentication');
            }

            // 1. Get the user's master credential
            const storePath = path.join(config.masterCredentialStorePath, `${userId}.json`);
            const fileContent = await fs.readFile(storePath, 'utf-8');
            const masterCredential: MasterCredential = JSON.parse(fileContent);

            // 2. Verify the proof against the master credential
            const isValid = await verifyProof(proof, masterCredential.merkleRoot, credential);

            if (!isValid) {
                return {
                    success: false,
                    message: 'Authentication failed: Invalid proof'
                };
            }

            const token = jwt.sign(
                { id: userId },
                config.jwtSecret as Secret,
                { expiresIn: config.jwtExpiresIn }
            );

            return {
                success: true,
                token
            };
        } catch (error) {
            console.error('Auth verification error:', error);
            return {
                success: false,
                message: 'Authentication failed'
            };
        }
    }
};