import appDebugger from 'debug';
import Util from '../utils/util';

/* Module */
const debug: appDebugger.IDebugger = appDebugger('claretiano:servererror-handler');

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function serverErrorHandle(error: Error, port?: string | number): void {
    debug('Realizando tratamento de erro fatal');

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

export default serverErrorHandle;
