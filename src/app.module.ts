import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import configuration from './config/configuration';
import { redisStore } from 'cache-manager-redis-store';
import { AppConfig } from './config/configuration.interface';
import { ServiceModule } from './services/service.module';
import { ExampleController } from './controllers/example.controller';
import { BlockchainController } from './controllers/blockchain.controller';
@Module({
    imports: [
        ServiceModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        CacheModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService<AppConfig>) => {
                const redisConfig = configService.get('redis');
                return {
                    store: await redisStore({
                        socket: {
                            host: redisConfig.host,
                            port: redisConfig.port,
                        },
                        db: redisConfig.cacheDb,
                    }),
                };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [ExampleController, BlockchainController],
    providers: [],
})
export class AppModule {}
