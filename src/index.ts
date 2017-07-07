import * as path from 'path'

import Logger from './logger'

const winston: any = require('winston')

let logger: Logger = new Logger();

let timeformat = () => new Date().toISOString()

logger.define('logger', {
  transports: [
    logger.transport(
      winston.transports.Console,
      {
        colorize:     true,
        timestamp:    timeformat,
      }
    )
  ]
})

export = logger;
