import App from '@dfgpublicidade/node-app-module';
import { NextFunction, Request, Response } from 'express';
declare class InvalidRequestHandler {
    static handle(app: App, messageKey: string, errors?: {
        message: string;
    }[], status?: number): (req: Request, res: Response, next?: NextFunction) => Promise<void>;
}
export default InvalidRequestHandler;
