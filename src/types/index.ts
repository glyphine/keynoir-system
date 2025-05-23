export interface Credential {
    id: string;
    type: 'password' | 'biometric' | 'device' | 'token';
    value: string;
}

export interface MasterCredential {
    userId: string;
    merkleRoot: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ZKProof {
    proof: {
        pi_a: string[];
        pi_b: string[][];
        pi_c: string[];
        protocol: string;
    };
    publicSignals: string[];
}

export interface AuthRequest {
    userId: string;
    credential: Credential;
    proof?: ZKProof;
}

export interface AuthResponse {
    success: boolean;
    token?: string;
    message?: string;
}