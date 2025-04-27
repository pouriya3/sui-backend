import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateNFTDto } from '../_dtos/create-nft.dto';
import { NFTResponseDto } from '../_dtos/nft-response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { blockChainService } from '../services/blockchain.service';

@ApiTags('NFT')
@Controller('blockchain')
export class BlockchainController {
    constructor(private readonly blockchainService: blockChainService) {}

    @Post('make-nft')
    @ApiOperation({ summary: 'Create a new NFT' })
    @ApiResponse({
        status: 201,
        description: 'The NFT has been successfully created.',
        type: NFTResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    async createNFT(@Body() createNFTDto: CreateNFTDto): Promise<NFTResponseDto> {
        const nft = await this.blockchainService.mintNFT();

        return {
            message: 'NFT created successfully',
            data: nft,
        };
    }
}
