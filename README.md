# @nodeswork/logger

A wrapper on top of winston, to be shared across all nodeswork repos.

## Installation

```sh
$ npm install --save @nodeswork/logger
```

## How to use

Nodeswork Logger uses object's properties to create new winston instances each
time when the logger reference being called. This is because we set label to the
actual file path of the caller.  So for performance consideration, reference the
logger object at the top of the file where it is used.


### Default Logger

```javascript
// Javascript

{ logger } = require('logger');

logger.info("This is a test log.");
logger.error("Want to see an error log.");
```

### Add MongoDB Transport

```javascript
// Javascript

var winstonMongoDB = require('winston-mongodb');
var nwLogger       = require('@nodeswork/logger');

nwLogger.level     = process.env == 'production' ? 'warn' : 'info';
nwLogger.transports.push(
  nwLogger.transport(winston.transports.MongoDB, {
    db:         mongoose.connections[0].db,
    collection: 'logs',
  })
);
```

### Setup Requests Log

```javascript
// Javascript

var dailyRotate    = require('winston-daily-rotate-file');

nwLogger.define('requestLogger', {
  level:        'info',
  transports: [
    nwLogger.transport(winston.transports.MongoDB, {
      db:         mongoose.connections[0].db,
      collection: 'logs.requests',
    }),
    nwLogger.transport(winston.transports.DailyRotateFile, {
      filename:     './requests.log',
      datePattern:  'yyyy-MM-dd.',
      json:         false,
      prepend:      true,
    }),
  ],
});

var { requestLog } = require('logger');

requestLog.info("This is a request.");
```


### Reset the label

```javascript
// Javascript

winston    = require('winston');
{ logger } = require('logger');

logger.resetLabel(3); // set the 4th file name in the call stack as label
logger.resetLabel('labelString'); // set 'labelString' as the label
```

### For TypeScript

A little redundant but LOG has LoggerInstance type.

```typescript
// TypeScript

import * as logger from '@nodeswork/logger'

let LOG = logger.getLogger('logger');

LOG.info("hello world");
```

Simpler but lost log type.

```typescript
// TypeScript

let { logger } = require('@nodeswork/logger');

logger.info('hello world');
```
