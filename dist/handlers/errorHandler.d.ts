import App from '@dfgpublicidade/node-app-module';
import { NextFunction, Request, Response } from 'express';
declare class ErrorHandler {
    static handle(app: App): (error: any, req: Request, res: Response, next?: NextFunction) => Promise<void>;
}
export default ErrorHandler;
