import App from '@dfgpublicidade/node-app-module';
import { ImageUploadError, UploadError } from '@dfgpublicidade/node-upload-module';
import { NextFunction, Request, Response } from 'express';
declare class InvalidUploadHandler {
    static handle(app: App, error: UploadError | ImageUploadError, uploadConfig: any): (req: Request, res: Response, next?: NextFunction) => Promise<void>;
}
export default InvalidUploadHandler;
