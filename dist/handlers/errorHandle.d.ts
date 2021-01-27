import App from '@dfgpublicidade/node-app-module';
import { NextFunction, Request, Response } from 'express';
declare function errorHandle(app: App, errorCode: string, errorMessage: string): (error: any, req: Request, res: Response, next: NextFunction) => void;
export default errorHandle;
