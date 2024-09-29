import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SendFormDto {
    @IsNotEmpty()
    @IsString()
    readonly fio: string;

    @IsNotEmpty()
    readonly telephone: string;
}
