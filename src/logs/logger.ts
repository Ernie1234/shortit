import winston, { transports } from 'winston';

const { combine, timestamp, json, printf, colorize, align } = winston.format;

winston.loggers.add('basicLogger', {
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    json(),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
  ),
  transports: [
    new winston.transports.Console(),
    new transports.File({
      filename: 'events.log',
      dirname: './src/logs',
      level: 'info',
    }),
    new transports.File({
      filename: 'errors.log',
      dirname: './src/logs',
      level: 'error',
    }),
  ],
});
