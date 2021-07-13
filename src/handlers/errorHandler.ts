import App from '@dfgpublicidade/node-app-module';
import Log from '@dfgpublicidade/node-log-module';
import Result, { HttpStatus, ResultStatus } from '@dfgpublicidade/node-result-module';
import appDebugger from 'debug';
import { NextFunction, Request, Response } from 'express';

/* Module */
const debug: appDebugger.IDebugger = appDebugger('module:error-handler');

class ErrorHandler {
    public static handle(app: App): (error: any, req: Request, res: Response, next?: NextFunction) => Promise<void> {
        return async (error: any, req: Request, res: Response, next?: NextFunction): Promise<void> => {
            debug('Handling request error');

            const status: number = HttpStatus.internalError;

            const result: Result = new Result(ResultStatus.ERROR, {
                message: res.lang ? res.lang('internalError') : 'An error has occurred',
                error: error.message
            });

            res.status(status);
            res.json(result);

            await Log.emit(app, req, app.config.log.collections.error, {
                code: status,
                errorCode: error.code,
                error: error.message
            });

            // eslint-disable-next-line no-console
            console.error(error);
        };
    }
}

export default ErrorHandler;
