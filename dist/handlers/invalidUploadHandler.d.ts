import App from '@dfgpublicidade/node-app-module';
import { FileUpload, ImageUpload, ImageUploadError, UploadError } from '@dfgpublicidade/node-upload-module';
import { NextFunction, Request, Response } from 'express';
declare class InvalidUploadHandler {
    static handle(app: App, upload: FileUpload | ImageUpload, error: UploadError | ImageUploadError): (req: Request, res: Response, next?: NextFunction) => Promise<void>;
}
export default InvalidUploadHandler;
