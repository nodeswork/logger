"use strict";
exports.__esModule = true;
var _ = require("underscore");
var winston = require('winston');
var ErrorStackParser = require('error-stack-parser');
function getLabelFromCallStack(labelOption) {
    if (labelOption === void 0) { labelOption = 1; }
    if (_.isString(labelOption)) {
        return labelOption;
    }
    var stacks = _.union(_.map(ErrorStackParser.parse(new Error()), _.property('fileName')));
    return stacks[labelOption] || 'unkown';
}
var Logger = (function () {
    function Logger(options) {
        if (options === void 0) { options = {}; }
        this.transports = _.union(options.transports);
    }
    Logger.prototype.define = function (name, options) {
        if (options === void 0) { options = {}; }
        Object.defineProperties(this, (_a = {},
            _a[name + ''] = {
                get: function () {
                    var label = getLabelFromCallStack();
                    var transports = _.union(this.transports, options.transports);
                    var winstonTransports = _.map(transports, function (_a) {
                        var cls = _a.cls, opts = _a.opts;
                        return new cls(_.extend({ label: label }, opts));
                    });
                    var winstonLogger = new winston.Logger(_.extend({}, options, { transports: winstonTransports }));
                    winstonLogger.label = label;
                    winstonLogger.resetLabel = function (labelOption) {
                        var label = getLabelFromCallStack(labelOption);
                        var transport;
                        for (var _i = 0, winstonTransports_1 = winstonTransports; _i < winstonTransports_1.length; _i++) {
                            transport = winstonTransports_1[_i];
                            transport.label = label;
                        }
                        winstonLogger.label = label;
                        return label;
                    };
                    return winstonLogger;
                }
            },
            _a));
        var _a;
    };
    Logger.prototype.transport = function (cls, opts) {
        return { cls: cls, opts: opts };
    };
    Logger.Logger = Logger;
    return Logger;
}());
exports["default"] = Logger;
