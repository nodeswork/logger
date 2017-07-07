export interface WinstonTransportConstructor {
    new (optoins: any): Object;
}
export interface LoggerOption {
    transports?: Array<Transport>;
}
export interface Transport {
    cls: WinstonTransportConstructor;
    opts: object;
}
declare class Logger {
    static Logger: object;
    transports: Array<Transport>;
    constructor(options?: LoggerOption);
    define(name: string, options?: LoggerOption): void;
    transport(cls: WinstonTransportConstructor, opts: object): Transport;
}
export default Logger;
