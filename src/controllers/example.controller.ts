import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('example')
export class ExampleController {
    private data: any[] = [];

    @Get('items')
    getData() {
        return {
            message: 'Data retrieved successfully',
            data: this.data,
        };
    }

    @Post('items')
    createData(@Body() body: any) {
        this.data.push(body);
        return {
            message: 'Data created successfully',
            data: body,
        };
    }
}
