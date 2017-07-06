# @nodeswork/logger

A wrapper on top of winston, to be shared across all nodeswork repos.

## Installation

```sh
$ npm i -S @nodeswork/logger
```

## How to use

Nodeswork Logger uses object's properties to create new winston instances each
time when the logger reference being called. This is because we set label to the
actual file path of the caller.  So for performance consideration, reference the
logger object at the top of the file where it is used.


### Default Logger

```javascript
{logger} = require('logger');

logger.info("This is a test log.");
logger.error("Want to see an error log.");
```


### Create new logger using customized transports

```coffeescript
winston  = require 'winston'
nwLogger = require 'logger'

nwLogger.addLogger 'requestLog', transports: [
  nwLogger.transport winston.transports.Console, {
    colorize: true
  }
]

{requestLog} = require 'logger'

requestLog.info "Another one without timestamp."
```
