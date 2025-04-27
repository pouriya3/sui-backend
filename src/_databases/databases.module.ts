import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis/redis.service';
import { RedisHelperService } from './redis/redisHelper.service';
import { RedisQueueHelperService } from './redis/redisQueueHelper.service';

@Global()
@Module({
    providers: [RedisService, RedisHelperService, RedisQueueHelperService],
    exports: [RedisService, RedisHelperService, RedisQueueHelperService],
})
export class DatabasesModule {}
