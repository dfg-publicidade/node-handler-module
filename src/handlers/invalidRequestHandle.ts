import App from '@dfgpublicidade/node-app-module';
import Result, { HttpStatus, ResultStatus } from '@dfgpublicidade/node-result-module';
import appDebugger from 'debug';
import { NextFunction, Request, Response } from 'express';

/* Module */
const debug: appDebugger.IDebugger = appDebugger('module:invalid-request-handler');

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function invalidRequestHandle(app: App, messageKey: string, errors?: { message: string }[], status?: number): (req: Request, res: Response, next?: NextFunction) => void {
    return async (req: Request, res: Response, next?: NextFunction): Promise<any> => {
        debug('Handling invalid data');

        const result: Result = new Result(ResultStatus.WARNING, {
            message: res.lang(messageKey),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            errors_validation: errors?.map((error: any): string => error.message)
        });

        res.status(status ? status : HttpStatus.badRequest);
        res.json(result);
    };
}

export default invalidRequestHandle;
