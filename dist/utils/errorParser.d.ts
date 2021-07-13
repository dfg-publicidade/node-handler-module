import { ImageUploadError, UploadError } from '@dfgpublicidade/node-upload-module';
import { Response } from 'express';
declare class ErrorParser {
    static parseImageUploadError(res: Response, error: ImageUploadError, config: any): {
        code: string;
        message: string;
    };
    static parseUploadError(res: Response, error: UploadError, config: any): {
        code: string;
        message: string;
    };
}
export default ErrorParser;
