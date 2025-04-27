import { SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { Injectable } from '@nestjs/common';

import { AppConfig } from '../config/configuration.interface';
import { ConfigService } from '@nestjs/config';

const MODULE_NAME = 'non_transferable_nft';

const MINT_ARGS = {
    name: 'CERT NFT',
    description: 'This NFT is a certificate for a course. And it is non-transferable.',
    url: 'ipfs://QmW8b1MRgiaSBtgcWjYYYAuWrhjitV2QbNCUJnnAihFNE5',
};

@Injectable()
export class blockChainService {
    private config: AppConfig['blockchain'];
    constructor(private readonly configService: ConfigService<AppConfig>) {
        this.config = configService.get('blockchain');
    }

    suiPrivateKeyToBytes(privateKey) {
        const base64Key = privateKey.replace('suiprivkey1', '');
        return Buffer.from(base64Key, 'base64');
    }

    async mintNFT() {
        try {
            if (!this.config.packageId) {
                throw new Error('PACKAGE_ID is not set in .env file');
            }

            if (!this.config.privateKey) {
                throw new Error('PRIVATE_KEY is not set in .env file');
            }

            const { secretKey } = decodeSuiPrivateKey(this.config.privateKey);
            const keypair = Ed25519Keypair.fromSecretKey(secretKey);

            const client = new SuiClient({ url: this.config.rpc });

            const tx = new Transaction();
            tx.moveCall({
                target: `${this.config.packageId}::${MODULE_NAME}::${'mint'}`,
                arguments: [
                    tx.pure.string(MINT_ARGS.name),
                    tx.pure.string(MINT_ARGS.description),
                    tx.pure.string(MINT_ARGS.url),
                ],
            });

            // Sign and execute transaction
            const response = await client.signAndExecuteTransaction({
                signer: keypair,
                transaction: tx,
            });

            console.log('Transaction response:', response);

            // Wait for transaction to be confirmed and get the created object
            const txEffects = await client.waitForTransaction({
                digest: response.digest,
                options: {
                    showEffects: true,
                    showObjectChanges: true,
                },
            });

            console.log('Transaction effects:', txEffects);

            // Find the created NFT object
            const createdObjects: any = txEffects.objectChanges?.filter(
                (change) => change.type === 'created' && change.objectType.includes('NonTransferableNFT')
            );
            let nftId: any;
            if (createdObjects && createdObjects.length > 0) {
                nftId = createdObjects[0].objectId;
                console.log('Successfully minted NFT with ID:', nftId);
                console.log('You can use this ID to send the NFT to another address');
            } else {
                console.log('Transaction successful but could not find NFT in created objects');
            }

            return {
                response,
                nftId,
            };
        } catch (e) {
            console.error('Error:', e.message);
            if (e.message.includes('Invalid Sui address')) {
                console.error('Please check your PACKAGE_ID in the .env file. It should be a valid Sui address.');
                console.error('Current PACKAGE_ID:', this.config.packageId);
            }
            throw e;
        }
    }

    async sendNFT(nftId, recipientAddress) {
        try {
            if (!this.config.packageId) {
                throw new Error('PACKAGE_ID is not set in .env file');
            }

            if (!this.config.privateKey) {
                throw new Error('PRIVATE_KEY is not set in .env file');
            }

            if (!nftId) {
                throw new Error('NFT ID is required');
            }

            if (!recipientAddress) {
                throw new Error('Recipient address is required');
            }

            // Initialize keypair
            const { secretKey } = decodeSuiPrivateKey(this.config.privateKey);
            const keypair = Ed25519Keypair.fromSecretKey(secretKey);

            const client = new SuiClient({ url: this.config.rpc });

            // Build transaction block
            const tx = new Transaction();
            tx.moveCall({
                target: `${this.config.packageId}::${MODULE_NAME}::${'send'}`,
                arguments: [
                    tx.object(nftId), // The NFT object to send
                    tx.pure.address(recipientAddress), // Recipient address
                ],
            });

            // Sign and execute transaction
            const response = await client.signAndExecuteTransaction({
                signer: keypair,
                transaction: tx,
            });

            console.log('Transaction response:', response);

            // Wait for transaction to be confirmed and get the created object
            const txEffects = await client.waitForTransaction({
                digest: response.digest,
                options: {
                    showEffects: true,
                    showObjectChanges: true,
                },
            });

            // console.log('Transaction effects:', txEffects);

            // // Find the created NFT object
            // const createdObjects = txEffects.objectChanges?.filter(
            //     (change) => change.type === 'created' && change.objectType.includes('NonTransferableNFT')
            // );

            // if (createdObjects && createdObjects.length > 0) {
            //     const nftId = createdObjects[0].objectId;
            //     console.log('Successfully Sent NFT with ID:', nftId);
            //     console.log('You can use this ID to send the NFT to another address');
            // } else {
            //     console.log('Transaction successful but could not find NFT in created objects');
            // }

            return response;
        } catch (e) {
            console.error('Error:', e.message);
            throw e;
        }
    }
}
