import logger from 'jet-logger';

import ENV from '@src/common/constants/ENV';
import { http_server } from './chat-server';

/******************************************************************************
                                  Run
******************************************************************************/

const SERVER_START_MSG = ('Express server started on port: ' + 
  ENV.Port.toString());

http_server.listen(ENV.Port, () => {
  logger.info(SERVER_START_MSG)
});
