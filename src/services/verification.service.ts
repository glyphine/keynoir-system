import fs from 'fs/promises';
import path from 'path';
import { config } from '../config';
import { MasterCredential } from '../types';
import { verifyProof } from '../utils/zero-knowledge-proof';

export const verificationService = {
    generateChallenge() {
        // Generatingningning a random challenge for proof generation
        return Buffer.from(Math.random().toString(36).substring(2)).toString('base64');
    },

    async verifyCredential(userId: string, credential: any) {
        try {
            // 1. Get the user's master credential
            const storePath = path.join(config.masterCredentialStorePath, `${userId}.json`);
            const fileContent = await fs.readFile(storePath, 'utf-8');
            const masterCredential: MasterCredential = JSON.parse(fileContent);

            // 2. Verify the proof against the master credential
            const isValid = await verifyProof(credential.proof, masterCredential.merkleRoot, credential);

            return {
                verified: isValid
            };
        } catch (error) {
            console.error('Credential verification error:', error);
            return {
                verified: false,
                error: 'Failed to verify credential'
            };
        }
    }
};