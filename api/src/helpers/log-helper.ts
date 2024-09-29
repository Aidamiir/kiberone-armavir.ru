import { bgBlue, bgRed, bold, whiteBright } from 'chalk';

export const errorLog = (s: string) => bgRed(whiteBright(bold(s)));
export const infoLog = (s: string) => bgBlue(whiteBright(bold(s)));
