import App from '@dfgpublicidade/node-app-module';
import { NextFunction, Request, Response } from 'express';
declare function notFoundHandle(app: App, errorCode: string, errorMessage: string): (req: Request, res: Response, next?: NextFunction) => void;
export default notFoundHandle;
