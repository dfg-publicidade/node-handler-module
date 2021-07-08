import App from '@dfgpublicidade/node-app-module';
import Result, { HttpStatus, ResultStatus } from '@dfgpublicidade/node-result-module';
import appDebugger from 'debug';
import { NextFunction, Request, Response } from 'express';

/* Module */
const debug: appDebugger.IDebugger = appDebugger('module:success-handler');

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function successHandle(app: App, messageKey: string, status?: number): (req: Request, res: Response, next?: NextFunction) => void {
    return async (req: Request, res: Response, next?: NextFunction): Promise<any> => {
        debug('Handling sucess');

        const result: Result = new Result(ResultStatus.SUCCESS, {
            message: res.lang(messageKey)
        });

        res.status(status ? status : HttpStatus.success);
        res.json(result);
    };
}

export default successHandle;
