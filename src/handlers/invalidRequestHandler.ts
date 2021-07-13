import App from '@dfgpublicidade/node-app-module';
import Result, { HttpStatus, ResultStatus } from '@dfgpublicidade/node-result-module';
import appDebugger from 'debug';
import { NextFunction, Request, Response } from 'express';

/* Module */
const debug: appDebugger.IDebugger = appDebugger('module:invalid-request-handler');

class InvalidRequestHandler {
    public static handle(app: App, messageKey: string, errors?: { message: string }[], status?: number): (req: Request, res: Response, next?: NextFunction) => Promise<void> {
        return async (req: Request, res: Response, next?: NextFunction): Promise<void> => {
            debug('Handling invalid request');

            const result: Result = new Result(ResultStatus.WARNING, {
                message: res.lang ? res.lang(messageKey) : 'Invalid request',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                errors_validation: errors?.map((error: any): string => error.message)
            });

            res.status(status ? status : HttpStatus.badRequest);
            res.json(result);
        };
    }
}

export default InvalidRequestHandler;
