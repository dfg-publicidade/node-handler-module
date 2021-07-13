import App from '@dfgpublicidade/node-app-module';
import Log from '@dfgpublicidade/node-log-module';
import Result, { HttpStatus, ResultStatus } from '@dfgpublicidade/node-result-module';
import appDebugger from 'debug';
import { NextFunction, Request, Response } from 'express';

/* Module */
const debug: appDebugger.IDebugger = appDebugger('module:nofound-handler');

class NotFoundHandler {
    public static handle(app: App, messageKey: string, status?: number): (req: Request, res: Response, next?: NextFunction) => Promise<void> {
        return async (req: Request, res: Response, next?: NextFunction): Promise<void> => {
            debug(`Handling not found: ${req.originalUrl}`);

            if (req.method === 'OPTIONS') {
                res.header('Access-Control-Allow-Methods', '');
                res.header('Access-Control-Allow-Headers', app.config.api.allowedHeaders);
                res.end();
            }
            else {
                const result: Result = new Result(ResultStatus.WARNING, {
                    message: res.lang(messageKey)
                });

                res.status(status ? status : HttpStatus.notImplemented);
                res.json(result);

                await Log.emit(app, req, app.config.log.collections.notFound, {
                    code: status ? status : HttpStatus.notImplemented,
                    error: 'Not found'
                });
            }
        };
    }
}

export default NotFoundHandler;
