import { AppConfig } from './configuration.interface';

export const baseConfig = (): Partial<AppConfig> => ({
    redis: {
        host: 'localhost',
        port: 6379,
        cacheDb: 11,
        sessionDb: 12,
    },
    ipfs: process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/',
    blockchain: {
        rpc: process.env.SUI_RPC_MAIN,
        packageId: process.env.PACKAGE_ID,
        privateKey: process.env.PRIVATE_KEY,
    },
});
