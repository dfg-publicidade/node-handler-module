import App from '@dfgpublicidade/node-app-module';
import { NextFunction, Request, Response } from 'express';
declare function notFoundHandle(app: App): (req: Request, res: Response, next?: NextFunction) => void;
export default notFoundHandle;
