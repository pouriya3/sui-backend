import { Injectable } from '@nestjs/common';

import { AppConfig } from '../config/configuration.interface';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
// import { create } from 'kubo-rpc-client';

import { readFile } from 'fs/promises';

@Injectable()
export class IpfsService {
    private IPFS_GATEWAY: string;

    // constructor(private readonly configService: ConfigService<AppConfig>) {
    //     this.IPFS_GATEWAY = this.configService.get('ipfs') || 'https://ipfs.io/ipfs/';
    //     this.save();
    // // }
    // save = async () => {
    //     const client = create({
    //         url: this.configService.get('ipfs'), // Replace with your QuickNode IPFS endpoint
    //         //   headers: {
    //         // 	Authorization: 'Bearer YOUR_API_KEY', // If authentication is required
    //         //   },
    //     });
    //     const fileData = await readFile(path.join(process.cwd(), 'src/assets/output.png'));
    //     const result = await client.add(fileData);
    //     console.log(result);
    // };
}
