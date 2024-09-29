import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { createResponseBody } from '../helpers/create-response-body';
import { errorLog } from '../helpers/log-helper';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const startTime = Date.now();

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const trace = exception instanceof Error ? exception.stack : '';

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Internal server error';

        let errorMessage: string;

        if (typeof message === 'string') {
            errorMessage = message;
        } else if (
            typeof message === 'object' &&
            message !== null &&
            'message' in message
        ) {
            errorMessage = (message as { message: string }).message;
        } else {
            errorMessage = 'Internal server error';
        }

        const duration = Date.now() - startTime;

        this.logger.error(
            errorLog(
                `HTTP Status: ${status} | Error Message: ${errorMessage} | Request Path: ${request.url} | Method: ${request.method} | IP: ${request.ip} +${duration}ms`,
            ),
            trace,
        );

        response.status(status).json(
            createResponseBody({
                data: null,
                isSuccess: false,
                message: errorMessage,
                details: trace,
            }),
        );
    }
}
