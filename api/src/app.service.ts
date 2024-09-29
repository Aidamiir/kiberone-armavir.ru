import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SendFormDto } from './dto/send-form.dto';

@Injectable()
export class AppService {
    private readonly chatId: string | null;
    private readonly token: string | null;

    constructor(private readonly configService: ConfigService) {
        this.chatId = configService.get('TELEGRAM_CHAT_ID');
        this.token = configService.get('TELEGRAM_TOKEN');
    }

    public async processForm(sendFormDto: SendFormDto) {
        const { fio, telephone } = sendFormDto;

        await this.sendToTelegram(fio, telephone);

        return true;
    }

    public async sendToTelegram(fio: string, telephone: string) {
        const date = new Date();
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        const message = `Новая заявка!\n\nФИО: ${fio}\nТелефон: ${telephone}\nДата: ${formattedDate}`;

        try {
            const response = await axios.post(
                `https://api.telegram.org/bot${this.token}/sendMessage`,
                { chat_id: this.chatId, text: message },
            );
        } catch (error) {
            console.error(
                'Произошла ошибка при отправке данных',
                error.response?.data || error.message,
            );
        }
    }
}
