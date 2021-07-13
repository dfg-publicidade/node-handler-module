import App from '@dfgpublicidade/node-app-module';
import Result, { HttpStatus, ResultStatus } from '@dfgpublicidade/node-result-module';
import { ImageUploadError, UploadError } from '@dfgpublicidade/node-upload-module';
import appDebugger from 'debug';
import { NextFunction, Request, Response } from 'express';
import ErrorParser from '../utils/errorParser';

/* Module */
const debug: appDebugger.IDebugger = appDebugger('module:invalid-request-handler');

class InvalidUploadHandler {
    public static handle(app: App, error: UploadError | ImageUploadError, uploadConfig: any): (req: Request, res: Response, next?: NextFunction) => Promise<void> {
        return async (req: Request, res: Response, next?: NextFunction): Promise<void> => {
            debug('Handling invalid upload');

            const result: Result = new Result(ResultStatus.WARNING,
                (error === 'OUT_OF_DIMENSION' || error === 'INVALID_MODE')
                    ? ErrorParser.parseImageUploadError(res, error, uploadConfig)
                    : ErrorParser.parseUploadError(res, error as any, uploadConfig)
            );

            res.status(HttpStatus.badRequest);
            res.json(result);
        };
    }
}

export default InvalidUploadHandler;
