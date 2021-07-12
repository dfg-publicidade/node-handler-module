import App from '@dfgpublicidade/node-app-module';
import { NextFunction, Request, Response } from 'express';
declare function invalidRequestHandle(app: App, messageKey: string, errors?: {
    message: string;
}[], status?: number): (req: Request, res: Response, next?: NextFunction) => void;
export default invalidRequestHandle;
