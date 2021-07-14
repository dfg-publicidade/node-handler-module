import App from '@dfgpublicidade/node-app-module';
import Paginate from '@dfgpublicidade/node-pagination-module';
import { NextFunction, Request, Response } from 'express';
declare class SuccessHandler {
    static handle(app: App, content: any, options?: {
        status?: number;
        contentType?: string;
        contentDisposition?: 'inline' | 'attachment';
        filename?: string;
        ext?: string;
        paginate?: Paginate;
    }): (req: Request, res: Response, next?: NextFunction) => Promise<void>;
}
export default SuccessHandler;
