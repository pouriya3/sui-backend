import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNFTDto {
    @ApiProperty({
        description: 'The name of the NFT',
        example: 'My Awesome NFT',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The last name of the NFT owner',
        example: 'Doe',
    })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({
        description: 'The curse name of the NFT',
        example: 'Curse of the Dragon',
    })
    @IsString()
    @IsNotEmpty()
    curseName: string;
}
