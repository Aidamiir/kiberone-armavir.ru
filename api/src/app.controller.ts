import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { SendFormDto } from './dto/send-form.dto';
import { createResponseBody } from './helpers/create-response-body';

@Controller('form')
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Post('submit')
    @HttpCode(200)
    public async handleFormSubmission(@Body() dto: SendFormDto) {
        const data = await this.appService.processForm(dto);
        return createResponseBody({
            data,
            message: 'Заявка успешно отправлена!',
        });
    }
}
