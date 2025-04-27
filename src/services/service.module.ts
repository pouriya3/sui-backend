import { Global, Module } from '@nestjs/common';
import { blockChainService } from './blockchain.service';
// import { IpfsService } from './ipfs.service';

@Global()
@Module({
    providers: [
        // IpfsService
        blockChainService,
    ],
    exports: [
        // IpfsService
        blockChainService,
    ],
})
export class ServiceModule {}
