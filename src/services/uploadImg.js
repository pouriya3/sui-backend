// // ipfs.controller.ts
// import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { IpfsService } from './ipfs.service';
// import { diskStorage } from 'multer';
// import { join } from 'path';

// @Controller('ipfs')
// export class IpfsController {
//   constructor(private readonly ipfsService: IpfsService) {}

//   @Post('upload')
//   @UseInterceptors(
//     FileInterceptor('file', {
//       storage: diskStorage({
//         destination: './uploads',
//         filename: (req, file, cb) => {
//           cb(null, `${Date.now()}-${file.originalname}`);
//         },
//       }),
//     }),
//   )
//   async uploadFile(@UploadedFile() file: Express.Multer.File) {
//     const filePath = join(__dirname, '..', '..', 'uploads', file.filename);
//     const cid = await this.ipfsService.uploadImage(filePath);
//     return { cid, url: `https://ipfs.io/ipfs/${cid}` };
//   }
// }
