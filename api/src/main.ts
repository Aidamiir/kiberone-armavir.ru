import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { errorLog } from './helpers/log-helper';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

export const logger = new Logger('Bootstrap');

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get('PORT', 8000);
    const corsOrigins = configService.get('CORS_ORIGINS');

    if (!corsOrigins) {
        logger.error(errorLog('CORS не указаны в env'));
        process.exit(1);
    }

    app.enableCors({
        origin: corsOrigins.split(',').map((origin) => origin.trim()),
        methods: 'POST, OPTIONS',
        allowedHeaders: 'Content-Type, Authorization',
    });
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            stopAtFirstError: true,
        }),
    );

    await app.listen(port);
    logger.log(`Приложение запущено на: http://localhost:${port}`);
}
bootstrap();
