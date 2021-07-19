import { FileUpload, ImageUpload, ImageUploadError, UploadError } from '@dfgpublicidade/node-upload-module';
import { Response } from 'express';
declare class ErrorParser {
    static parseImageUploadError(res: Response, upload: ImageUpload, error: ImageUploadError): {
        code: string;
        message: string;
    };
    static parseUploadError(res: Response, upload: FileUpload, error: UploadError): {
        code: string;
        message: string;
    };
}
export default ErrorParser;
