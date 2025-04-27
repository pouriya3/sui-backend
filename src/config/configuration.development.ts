import { AppConfig } from './configuration.interface';
import { baseConfig } from './configuration.base';

export default (): AppConfig => {
    const base = baseConfig();
    return {
        redis: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
            cacheDb: 11,
            sessionDb: 12,
        },

        ipfs: process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/',
        blockchain: {
            rpc: process.env.SUI_RPC_MAIN,
            packageId: process.env.PACKAGE_ID,
            privateKey: process.env.PRIVATE_KEY,
        },
    };
};
