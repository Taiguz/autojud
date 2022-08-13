import { createLogger, format, transports } from "winston";
import { dataHoje } from './../dataUtils'

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss:ms'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.simple()
  ),
  transports: [ // TODO rotate log files daily, request are already being rotated
    new transports.File({ filename: `./logs/${dataHoje}-server-error.log`, level: 'error' }),
    new transports.File({ filename: `./logs/${dataHoje}-server-info.log` })
  ]
});

export default logger