export interface RedisConfig {
    host: string;
    port: number;
    cacheDb: number;
    sessionDb: number;
}

export interface BlockchainConfig {
    rpc: string;
    packageId: string;
    privateKey: string;
}

export interface AppConfig {
    redis: RedisConfig;
    ipfs: string;
    blockchain: BlockchainConfig;
}
