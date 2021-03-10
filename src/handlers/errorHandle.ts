import App from '@dfgpublicidade/node-app-module';
import Log from '@dfgpublicidade/node-log-module';
import Result, { HttpStatus, ResultStatus } from '@dfgpublicidade/node-result-module';
import appDebugger from 'debug';
import { NextFunction, Request, Response } from 'express';

/* Module */
const debug: appDebugger.IDebugger = appDebugger('module:error-handler');

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function errorHandle(app: App, errorCode: string, errorMessageKey: string): (error: any, req: Request, res: Response, next: NextFunction) => void {
    return async (error: any, req: Request, res: Response, next: NextFunction): Promise<any> => {
        debug('Handling request error');

        const status: number = HttpStatus.internalError;

        const result: Result = new Result(ResultStatus.ERROR, {
            code: errorCode,
            message: res.lang(errorMessageKey),
            error: error.message
        });

        res.status(status);
        res.json(result);

        await Log.emit(app, req, app.config.log.collections.error, {
            code: status,
            error: error.message
        });

        // eslint-disable-next-line no-console
        console.error(error);
    };
}

export default errorHandle;
