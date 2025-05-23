import fs from 'fs/promises';
import path from 'path';
import { config } from '../config';
import { Credential, MasterCredential } from '../types';
import { fuseCredentials } from '../utils/credential-fusion';

export const credentialService = {
    async registerCredentials(userId: string, credentials: Credential[]) {
        try {
            // 1. Fuse credentials into a master credential
            const merkleRoot = await fuseCredentials(credentials);

            // 2. Create master credential record
            const masterCredential: MasterCredential = {
                userId,
                merkleRoot,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // 3. Store master credential
            const storePath = path.join(config.masterCredentialStorePath, `${userId}.json`);
            await fs.mkdir(path.dirname(storePath), { recursive: true });
            await fs.writeFile(storePath, JSON.stringify(masterCredential));

            return {
                success: true,
                userId,
                credentialsRegistered: credentials.length
            };
        } catch (error) {
            console.error('Error registering credentials:', error);
            throw new Error('Failed to register credentials');
        }
    },

    async updateCredentials(userId: string, credentials: Credential[]) {
        try {
            // 1. Check if user exists
            const storePath = path.join(config.masterCredentialStorePath, `${userId}.json`);
            await fs.access(storePath);

            // 2. Fuse new credentials
            const merkleRoot = await fuseCredentials(credentials);

            // 3. Update master credential
            const masterCredential: MasterCredential = {
                userId,
                merkleRoot,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // 4. Store updated master credential
            await fs.writeFile(storePath, JSON.stringify(masterCredential));

            return {
                success: true,
                userId,
                credentialsUpdated: credentials.length
            };
        } catch (error) {
            console.error('Error updating credentials:', error);
            throw new Error('Failed to update credentials');
        }
    },

    async getCredentialStatus(userId: string) {
        try {
            const storePath = path.join(config.masterCredentialStorePath, `${userId}.json`);
            const fileContent = await fs.readFile(storePath, 'utf-8');
            const masterCredential: MasterCredential = JSON.parse(fileContent);

            return {
                userId,
                hasCredentials: true,
                lastUpdated: masterCredential.updatedAt
            };
        } catch (error) {
            return {
                userId,
                hasCredentials: false
            };
        }
    }
};