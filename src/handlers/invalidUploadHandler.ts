import App from '@dfgpublicidade/node-app-module';
import Result, { HttpStatus, ResultStatus } from '@dfgpublicidade/node-result-module';
import { FileUpload, ImageUpload, ImageUploadError, UploadError } from '@dfgpublicidade/node-upload-module';
import appDebugger from 'debug';
import { NextFunction, Request, Response } from 'express';
import ErrorParser from '../utils/errorParser';

/* Module */
const debug: appDebugger.IDebugger = appDebugger('module:invalid-request-handler');

class InvalidUploadHandler {
    public static handle(app: App, upload: FileUpload | ImageUpload, error: UploadError | ImageUploadError): (req: Request, res: Response, next?: NextFunction) => Promise<void> {
        return async (req: Request, res: Response, next?: NextFunction): Promise<void> => {
            debug('Handling invalid upload');

            const result: Result = new Result(ResultStatus.WARNING,
                (error === 'OUT_OF_DIMENSION' || error === 'INVALID_MODE')
                    ? ErrorParser.parseImageUploadError(res, upload as ImageUpload, error)
                    : ErrorParser.parseUploadError(res, upload as FileUpload, error as any)
            );

            res.status(HttpStatus.badRequest);
            res.json(result);
        };
    }
}

export default InvalidUploadHandler;
