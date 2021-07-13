import App from '@dfgpublicidade/node-app-module';
import Result, { HttpStatus, ResultStatus } from '@dfgpublicidade/node-result-module';
import appDebugger from 'debug';
import { NextFunction, Request, Response } from 'express';

/* Module */
const debug: appDebugger.IDebugger = appDebugger('module:success-handler');

class SuccessHandler {
    public static handle(app: App, messageKey: string, status?: number): (req: Request, res: Response, next?: NextFunction) => Promise<void> {
        return async (req: Request, res: Response, next?: NextFunction): Promise<any> => {
            debug('Handling sucess');

            const result: Result = new Result(ResultStatus.SUCCESS, {
                message: res.lang(messageKey)
            });

            res.status(status ? status : HttpStatus.success);
            res.json(result);
        };
    }
}

export default SuccessHandler;
