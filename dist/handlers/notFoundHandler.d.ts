import App from '@dfgpublicidade/node-app-module';
import { NextFunction, Request, Response } from 'express';
declare class NotFoundHandler {
    static handle(app: App, messageKey: string, status?: number): (req: Request, res: Response, next?: NextFunction) => Promise<void>;
}
export default NotFoundHandler;
