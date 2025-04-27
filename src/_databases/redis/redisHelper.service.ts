import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { RedisService } from 'src/_databases/redis/redis.service';

@Injectable()
export class RedisHelperService implements OnApplicationBootstrap {
    private logger = new Logger(RedisHelperService.name);
    onApplicationBootstrap() {
        this.logger.log('RedisHelperService has been initialized');
    }

    constructor(private readonly rd: RedisService) {}
}
