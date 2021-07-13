import App from '@dfgpublicidade/node-app-module';
import { NextFunction, Request, Response } from 'express';
declare class SuccessHandler {
    static handle(app: App, content: any, status?: number): (req: Request, res: Response, next?: NextFunction) => Promise<void>;
}
export default SuccessHandler;
