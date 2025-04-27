import { ApiProperty } from '@nestjs/swagger';

export class NFTResponseDto {
    @ApiProperty({
        description: 'Response message',
        example: 'NFT created successfully',
    })
    message: string;

    @ApiProperty({
        description: 'NFT data containing transaction response and NFT ID',
        example: {
            response: {
                digest: '...',
                // other transaction response fields
            },
            nftId: '0x123...',
        },
    })
    data: {
        // response: any;
        link: string;
        // nftId: string;
    };
}
