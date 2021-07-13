import App from '@dfgpublicidade/node-app-module';
import Result, { HttpStatus, ResultStatus } from '@dfgpublicidade/node-result-module';
import Strings from '@dfgpublicidade/node-strings-module';
import appDebugger from 'debug';
import { NextFunction, Request, Response } from 'express';

/* Module */
const debug: appDebugger.IDebugger = appDebugger('module:success-handler');

class SuccessHandler {
    public static handle(app: App, content: any, status?: number, options?: {
        contentType?: string;
        contentDisposition?: 'inline' | 'attachment';
        filename?: string;
        ext?: string;
    }): (req: Request, res: Response, next?: NextFunction) => Promise<void> {
        return async (req: Request, res: Response, next?: NextFunction): Promise<any> => {
            debug('Handling sucess');

            res.status(status ? status : HttpStatus.success);

            if (options?.contentDisposition) {
                switch (options.contentDisposition) {
                    case 'inline': {
                        res.header('Content-Disposition', 'inline');
                        break;
                    }
                    case 'attachment': {
                        const filename: string = options.filename
                            ? `filename="${Strings.toUrl(options.filename)}${options.ext}"`
                            : '';

                        res.header('Content-Disposition', `attachment; ${filename}`);
                        break;
                    }
                }
            }

            if (options?.contentType) {
                res.header('Content-Type', options.contentType);

                res.write(content);
                res.end();
            }
            else {
                const result: Result = new Result(ResultStatus.SUCCESS, content);
                res.json(result);
            }
        };
    }
}

export default SuccessHandler;
