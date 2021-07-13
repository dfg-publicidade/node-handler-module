import Util from '@dfgpublicidade/node-util-module';
import appDebugger from 'debug';

/* Module */
const debug: appDebugger.IDebugger = appDebugger('module:servererror-handler');

class ServerErrorHandler {
    public static handle(error: Error, port?: string | number): void {
        debug('Handling server error');

        switch (error.name) {
            case 'EACCES': {
                const bind: string = Util.parsePort(port);

                const msg: string = `${bind} requires elevated privileges`;

                // eslint-disable-next-line no-console
                console.error(msg);

                process.exit(1);
                break;
            }
            case 'EADDRINUSE': {
                const bind: string = Util.parsePort(port);

                const msg: string = `${bind} is already in use`;

                // eslint-disable-next-line no-console
                console.error(msg);

                process.exit(1);
                break;
            }
            default: {
                // eslint-disable-next-line no-console
                console.error(error);

                process.exit(1);
            }
        }
    }
}

export default ServerErrorHandler;
