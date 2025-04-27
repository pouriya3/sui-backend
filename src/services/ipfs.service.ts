// import { Injectable } from '@nestjs/common';
// import { createHelia } from 'helia';
// import { unixfs } from '@helia/unixfs';
// import { CID } from 'multiformats/cid';
// import { AppConfig } from '../config/configuration.interface';
// import { ConfigService } from '@nestjs/config';
// import * as fs from 'fs';
// import * as path from 'path';

// @Injectable()
// export class IpfsService {
//     private helia;
//     private fs;
//     private IPFS_GATEWAY: string;

//     constructor(private readonly configService: ConfigService<AppConfig>) {
//         this.IPFS_GATEWAY = this.configService.get('ipfs') || 'https://ipfs.io/ipfs/';
//         this.initializeHelia();
//     }

//     private async initializeHelia() {
//         this.helia = await createHelia();
//         this.fs = unixfs(this.helia);
//     }

//     async uploadImage(filePath: string): Promise<{ cid: string; ipfsUrl: string }> {
//         try {
//             // Read the file
//             const file = fs.readFileSync(filePath);
//             const fileName = path.basename(filePath);

//             // Add the file to IPFS
//             const cid = await this.fs.add({
//                 path: fileName,
//                 content: file,
//             });

//             // Convert CID to string
//             const cidString = cid.toString();

//             // Create IPFS URL
//             const ipfsUrl = `${this.IPFS_GATEWAY}${cidString}`;

//             return {
//                 cid: cidString,
//                 ipfsUrl,
//             };
//         } catch (error) {
//             console.error('Error uploading file to IPFS:', error);
//             throw new Error(`Failed to upload file to IPFS: ${error.message}`);
//         }
//     }

//     async stop() {
//         if (this.helia) {
//             await this.helia.stop();
//         }
//     }
// }
