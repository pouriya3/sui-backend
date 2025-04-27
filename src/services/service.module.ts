import { Global, Module } from '@nestjs/common';
import { blockChainService } from './blockchain.service';
import { ImageEditorService } from './imageEditor.service';
import { IpfsService } from './ipfs.service';

@Global()
@Module({
    providers: [IpfsService, ImageEditorService, blockChainService],
    exports: [IpfsService, blockChainService, ImageEditorService],
})
export class ServiceModule {}
