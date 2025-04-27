import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { AppConfig } from '../../config/configuration.interface';
import { RdKeysEnum, RdQueuesEnum } from './redisKeys';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);
    public readonly RK = RdKeysEnum;
    public readonly RQK = RdQueuesEnum;
    private client: Redis;

    constructor(private readonly configService: ConfigService<AppConfig>) {}

    async onModuleInit() {
        const redisConfig = this.configService.get('redis');

        this.client = new Redis({
            host: redisConfig.host,
            port: redisConfig.port,
            db: redisConfig.cacheDb,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            maxRetriesPerRequest: 3,
        });

        this.client.on('error', (error) => {
            this.logger.error('Redis connection error:', error);
        });

        this.client.on('connect', () => {
            this.logger.log('Redis client connected successfully');
        });

        this.client.on('ready', () => {
            this.logger.log('Redis client is ready');
        });

        this.client.on('close', () => {
            this.logger.warn('Redis connection closed');
        });

        this.client.on('reconnecting', () => {
            this.logger.log('Redis client reconnecting...');
        });
    }

    async onModuleDestroy() {
        if (this.client) {
            await this.client.quit();
            this.logger.log('Redis connection closed');
        }
    }

    get cacheCli(): Redis {
        if (!this.client) {
            throw new Error('Redis client not initialized');
        }
        return this.client;
    }

    // Helper method to create a new Redis client with different database index
    createClient(dbIndex: number): Redis {
        const redisConfig = this.configService.get('redis');
        return new Redis({
            host: redisConfig.host,
            port: redisConfig.port,
            db: dbIndex,
        });
    }
}
