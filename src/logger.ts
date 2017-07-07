import * as _ from 'underscore'

const winston: any = require('winston');
const ErrorStackParser: any = require('error-stack-parser');


export interface WinstonTransportConstructor {
  new (optoins: any): Object
}


export interface LoggerOption {
  transports?: Array<Transport>
}


export interface Transport {
  cls:   WinstonTransportConstructor
  opts:  object
}

type LabelOption = number | string;


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

  static Logger: object = Logger;

  transports: Array<Transport>;

  constructor(options: LoggerOption = {}) {
    this.transports = _.union(options.transports);
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

            let winstonLogger = new winston.Logger(
              _.extend({}, options, { transports: winstonTransports })
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
            }

            return winstonLogger;
          }
        }
      })
  }

  transport(cls: WinstonTransportConstructor, opts: object): Transport {
    return { cls, opts }
  }
}


export default Logger
