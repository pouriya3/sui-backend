import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { RedisService } from 'src/_databases/redis/redis.service';
import * as redisTypes from 'src/_databases/redis/redisKeys';

@Injectable()
export class RedisQueueHelperService implements OnApplicationBootstrap {
    public readonly RQK = redisTypes.RdQueuesEnum;
    private logger = new Logger(RedisQueueHelperService.name);

    constructor(private readonly rd: RedisService) {}

    onApplicationBootstrap() {}

    // Add item to queue
    async enqueue(queueName: redisTypes.RdQueuesEnum, item: any, uniqueFieldName?: string): Promise<void> {
        const queue = uniqueFieldName ? `${queueName}_${uniqueFieldName}` : queueName;
        try {
            await this.rd.cacheCli.lpush(queue, JSON.stringify(item));
        } catch (error) {
            this.logger.error(`Failed to enqueue item to ${queue}:, ${JSON.stringify(error)}`);
            throw error;
        }
    }

    // Remove and get item from queueName
    async dequeue(queueName: redisTypes.RdQueuesEnum, uniqueFieldName?: string): Promise<any> {
        const queue = uniqueFieldName ? `${queueName}_${uniqueFieldName}` : queueName;
        try {
            const item = await this.rd.cacheCli.rpop(queue);
            if (item) {
                return JSON.parse(item);
            }
            return null;
        } catch (error) {
            this.logger.error(`Failed to dequeue item from ${queue}:, ${JSON.stringify(error)}`);
            throw error;
        }
    }

    async deleteItemFromQueue(queueName: redisTypes.RdQueuesEnum, item: any, uniqueFieldName?: string): Promise<void> {
        const queue = uniqueFieldName ? `${queueName}_${uniqueFieldName}` : queueName;
        try {
            const itemString = JSON.stringify(item);
            await this.rd.cacheCli.lrem(queue, 1, itemString);
        } catch (error) {
            this.logger.error(`Failed to delete item from ${queue}:, ${JSON.stringify(error)}`);
            throw error;
        }
    }

    async enqueueUnique(options: {
        queueName: redisTypes.RdQueuesEnum;
        item: any;
        uniqueDataForSet: any;
        uniqueFieldName?: string;
    }) {
        const { queueName, item, uniqueDataForSet, uniqueFieldName } = options;
        const queue = uniqueFieldName ? `${queueName}_${uniqueFieldName}` : queueName;
        const setName = `${queue}_set`;

        try {
            const added = await this.rd.cacheCli.sadd(setName, uniqueDataForSet);
            if (added === 0) {
                this.logger.debug('Task already exists, skipping...');
                return false;
            }

            await this.rd.cacheCli.rpush(queue, JSON.stringify(item));
            return true;
        } catch (error) {
            this.logger.error(`Failed to enqueue unique item to ${queue}:, ${JSON.stringify(error)}`);
            throw error;
        }
    }

    async isElementInSet(options: {
        queueName: redisTypes.RdQueuesEnum;
        uniqueDataForSet: any;
        uniqueFieldName?: string;
    }) {
        const { queueName, uniqueDataForSet, uniqueFieldName } = options;
        const queue = uniqueFieldName ? `${queueName}_${uniqueFieldName}` : queueName;
        const setName = `${queue}_set`;

        try {
            const exists = await this.rd.cacheCli.sismember(setName, uniqueDataForSet);
            return exists === 1;
        } catch (error) {
            this.logger.error(`Error checking element exists in set ${setName}: ${error.message}`);
            return false;
        }
    }

    async getSetLength(options: { queueName: redisTypes.RdQueuesEnum; uniqueFieldName?: string }): Promise<number> {
        const { queueName, uniqueFieldName } = options;
        const queue = uniqueFieldName ? `${queueName}_${uniqueFieldName}` : queueName;
        const setName = `${queue}_set`;

        try {
            const length = await this.rd.cacheCli.scard(setName);
            return length;
        } catch (error) {
            this.logger.error(`Failed to get set length of ${queue}:, ${JSON.stringify(error)}`);
            throw error;
        }
    }

    async deleteKeyFromSet(options: {
        queueName: redisTypes.RdQueuesEnum;
        uniqueDataForSet: any;
        uniqueFieldName?: string;
    }): Promise<void> {
        const { queueName, uniqueDataForSet, uniqueFieldName } = options;
        const queue = uniqueFieldName ? `${queueName}_${uniqueFieldName}` : queueName;
        const setName = `${queue}_set`;

        try {
            await this.rd.cacheCli.srem(setName, uniqueDataForSet);
        } catch (error) {
            this.logger.error(`Failed to delete key from set ${queue}:, ${JSON.stringify(error)}`);
            throw error;
        }
    }

    async dequeueAndRemoveFromSets(
        queueName: redisTypes.RdQueuesEnum,
        uniqueDataForSet: any,
        uniqueFieldName?: string
    ) {
        const queue = uniqueFieldName ? `${queueName}_${uniqueFieldName}` : queueName;
        const setName = `${queue}_set`;

        try {
            const exists = await this.rd.cacheCli.sismember(setName, uniqueDataForSet);
            if (exists === 0) {
                this.logger.debug('Task does not exist, skipping...');
                return null;
            }

            await this.rd.cacheCli.srem(setName, uniqueDataForSet);
            const item = await this.rd.cacheCli.lpop(queue);
            if (item) {
                return JSON.parse(item);
            }
            return null;
        } catch (error) {
            this.logger.error(`Failed to dequeue and remove from sets for ${queue}:, ${JSON.stringify(error)}`);
            throw error;
        }
    }

    // Get the length of the queueName
    async getQueueLength(queueName: redisTypes.RdQueuesEnum, uniqueFieldName?: string): Promise<number> {
        const queue = uniqueFieldName ? `${queueName}_${uniqueFieldName}` : queueName;
        try {
            return await this.rd.cacheCli.llen(queue);
        } catch (error) {
            this.logger.error(`Failed to get queue length of ${queue}:, ${JSON.stringify(error)}`);
            throw error;
        }
    }

    // Peek at the first item in the queueName without removing it
    async peekQueue(queueName: redisTypes.RdQueuesEnum, uniqueFieldName?: string): Promise<any> {
        const queue = uniqueFieldName ? `${queueName}_${uniqueFieldName}` : queueName;
        try {
            const item = await this.rd.cacheCli.lindex(queue, 0);
            if (item) {
                return JSON.parse(item);
            }
            return null;
        } catch (error) {
            this.logger.error(`Failed to peek queue ${queue}:, ${JSON.stringify(error)}`);
            throw error;
        }
    }

    async clearQueue(queueName: redisTypes.RdQueuesEnum, removeSet = false, uniqueFieldName?: string): Promise<void> {
        const queue = uniqueFieldName ? `${queueName}_${uniqueFieldName}` : queueName;
        const setName = `${queue}_set`;
        try {
            await this.rd.cacheCli.del(queue);
            if (removeSet) {
                await this.rd.cacheCli.del(setName);
            }
        } catch (error) {
            this.logger.error(`Failed to clear queue ${queue}:, ${JSON.stringify(error)}`);
            throw error;
        }
    }

    async clearSet(queueName: redisTypes.RdQueuesEnum, uniqueFieldName?: string): Promise<void> {
        const queue = uniqueFieldName ? `${queueName}_${uniqueFieldName}` : queueName;
        const setName = `${queue}_set`;
        try {
            await this.rd.cacheCli.del(setName);
        } catch (error) {
            this.logger.error(`Failed to clear set ${queue}:, ${JSON.stringify(error)}`);
            throw error;
        }
    }

    async getAllItems(queueName: redisTypes.RdQueuesEnum, uniqueFieldName?: string): Promise<any[]> {
        const queue = uniqueFieldName ? `${queueName}_${uniqueFieldName}` : queueName;
        try {
            const items = await this.rd.cacheCli.lrange(queue, 0, -1);
            return items.map((item) => JSON.parse(item));
        } catch (error) {
            this.logger.error(`Failed to get all items from queue ${queue}:, ${JSON.stringify(error)}`);
            throw error;
        }
    }
    // it take from start to end and remove them also start and end
    async fetchBatchItemAndRemove(options: {
        queueName: redisTypes.RdQueuesEnum;
        start: number;
        end: number;
        uniqueFieldName?: string;
        backOpQueueFieldName?: string;
    }) {
        try {
            const { queueName, start, end, uniqueFieldName } = options;
            var queue = uniqueFieldName ? `${queueName}_${uniqueFieldName}` : queueName;

            const items = await this.rd.cacheCli.lrange(queue, start, end);
            if (items.length === 0) {
                // No items found in the specified range
                return [];
            }

            // Parse the items as JSON
            const parsedItems = items.map((item) => {
                try {
                    return JSON.parse(item);
                } catch (err) {
                    throw new Error(`Failed to parse JSON: , ${item}`);
                    return [];
                }
            });

            if (options.backOpQueueFieldName) {
                const backOpQueue = `${queueName}_${options.backOpQueueFieldName}`;
                for (const item of parsedItems) {
                    await this.rd.cacheCli.rpush(backOpQueue, JSON.stringify(item));
                }
            }
            // Create a transaction to remove exact range
            const pipeline = this.rd.cacheCli.pipeline();
            for (let i = start; i <= end; i++) {
                pipeline.lset(queue, i, '__DELETE__');
            }
            await pipeline.exec();
            await this.rd.cacheCli.lrem(queue, 0, '__DELETE__');

            return parsedItems;
        } catch (error) {
            this.logger.error(`Error processing queueName: ${JSON.stringify(error)}`);
            return [];
        }
    }

    async fetchBatchItemAndRemoveFromSetAndQueue(options: {
        queueName: redisTypes.RdQueuesEnum;
        start: number;
        end: number;
        uniqueFieldName?: string;
    }) {
        const { queueName, start, end, uniqueFieldName } = options;
        var queue = uniqueFieldName ? `${queueName}_${uniqueFieldName}` : queueName;
        const setName = `${queue}_set`;

        // Fetch elements from the queueName
        const items = await this.rd.cacheCli.lrange(queue, start, end);
        if (items.length === 0) {
            return [];
        }

        // Parse the items as JSON
        const parsedItems = items.map((item) => {
            try {
                return JSON.parse(item);
            } catch (err) {
                throw new Error(`Failed to parse JSON: , ${item}`);
                return [];
            }
        });

        // Create a transaction to remove exact range
        const pipeline = this.rd.cacheCli.pipeline();
        for (let i = start; i <= end; i++) {
            pipeline.lset(queue, i, '__DELETE__');
        }
        await pipeline.exec();
        await this.rd.cacheCli.lrem(queue, 0, '__DELETE__');

        // Remove processed tasks from the set
        await this.rd.cacheCli.srem(setName, ...items);

        console.log(`Removed ${items.length} items from queue: ${queue}`);
        return parsedItems;
    }
}
