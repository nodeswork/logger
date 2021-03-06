import * as _       from 'underscore'
import * as winston from 'winston'

const DEFAULT_LEVEL = process.env.DEBUG ? 'debug' : 'info';
const ErrorStackParser: any = require('error-stack-parser');

export interface LoggerInstance extends winston.LoggerInstance {
  label: string
  resetLabel(labelOption: LabelOption): string
}

export interface WinstonTransportConstructor {
  new (options: any): Object
}

export interface LoggerOption {
  level?:       string;
  transports?:  Array<Transport>;
}

export interface Transport {
  cls:   WinstonTransportConstructor
  opts:  object
}

export type LabelOption = number | string;

function getLabelFromCallStack(labelOption: LabelOption = 1) {
  if (_.isString(labelOption)) {
    return labelOption;
  }

  let stacks = _.union(_.map(
    ErrorStackParser.parse(new Error()),
    _.property('fileName')
  ));

  return stacks[<number>labelOption] || 'unkown';
}

class Logger {

  level:      string;
  transports: Array<Transport>;

  constructor(options: LoggerOption = {}) {
    this.transports = _.union(options.transports);
    this.level      = options.level || DEFAULT_LEVEL;
  }

  configure(options: LoggerOption = {}) {
    if (options.transports) {
      this.transports = options.transports;
    }
    if (options.level) {
      this.level = options.level;
    }
  }

  define(name: string, options: LoggerOption = {}): void {
    Object.defineProperties(
      this,
      {
        [name + '']: {
          get: function() {
            let label       = getLabelFromCallStack();
            let transports  = _.union(this.transports, options.transports);

            let winstonTransports = _.map(transports, ({cls, opts}) => {
              return new cls(_.extend({label}, opts));
            });

            let winstonLogger: LoggerInstance = <LoggerInstance>(
              new winston.Logger(
                _.extend(
                  { level: this.level },
                  options,
                  { transports: winstonTransports }
                )
              )
            );

            winstonLogger.label = label;

            winstonLogger.resetLabel = (labelOption: LabelOption) => {
              var label: string = getLabelFromCallStack(labelOption);
              var transport: any;
              for (transport of winstonTransports) {
                transport.label = label;
              }
              winstonLogger.label = label;
              return label;
            };

            return winstonLogger;
          },
        },
      },
    );
  }

  getLogger(name: string = 'logger'): LoggerInstance {
    return <LoggerInstance>(<any>this)[name];
  }

  transport(cls: WinstonTransportConstructor, opts: object): Transport {
    return { cls, opts }
  }
}

export default Logger
