import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { AppConfig } from '../config/configuration.interface';
import { ConfigService } from '@nestjs/config';

import { createCanvas, loadImage } from 'canvas';
const MODULE_NAME = 'non_transferable_nft';

@Injectable()
export class ImageEditorService {
    private config: AppConfig['blockchain'];
    constructor(private readonly configService: ConfigService<AppConfig>) {
        this.config = configService.get('blockchain');

        setTimeout(() => {
            this.test();
        }, 1000);
    }

    async test() {
        // Example usage
        await this.addTextToImage('pouriya', 'sabzi', 'cert nft curse');
    }

    async addTextToImage(name: string, lastName: string, curseName: string) {
        let inputPath = path.join(process.cwd(), 'src/assets/template.png');
        let outputPath = path.join(process.cwd(), 'src/assets/output.png');
        let x = 300;
        let y = 80;

        const image = await loadImage(inputPath);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(image, 0, 0);
        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(name, x, y);

        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(lastName, x + 50, y + 35);

        ctx.font = 'bold 30px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(curseName, x + 160, y + 110);

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);
    }
}
