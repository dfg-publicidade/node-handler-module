import App from '@dfgpublicidade/node-app-module';
import Cache, { CacheLevel } from '@dfgpublicidade/node-cache-module';
import Log from '@dfgpublicidade/node-log-module';
import Paginate from '@dfgpublicidade/node-pagination-module';
import Result, { HttpStatus, ResultStatus } from '@dfgpublicidade/node-result-module';
import Strings from '@dfgpublicidade/node-strings-module';
import appDebugger from 'debug';
import { NextFunction, Request, Response } from 'express';

/* Module */
const debug: appDebugger.IDebugger = appDebugger('module:success-handler');

class SuccessHandler {
    public static handle(app: App, content: any, options?: {
        status?: number;
        contentType?: string;
        contentDisposition?: 'inline' | 'attachment';
        filename?: string;
        ext?: string;
        paginate?: Paginate;
        transform?: (item: any) => any;
        flush?: CacheLevel[];
        log?: boolean;
    }): (req: Request, res: Response, next?: NextFunction) => Promise<void> {
        return async (req: Request, res: Response, next?: NextFunction): Promise<any> => {
            try {
                debug('Handling success');

                res.status(options?.status ? options.status : HttpStatus.success);

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
                    if (options?.transform && content) {
                        if (content.items && Array.isArray(content.items)) {
                            content.items = content.items.map((item: any): any => options.transform(item));
                        }
                        else {
                            content = options.transform(content);
                        }
                    }

                    const result: Result = new Result(ResultStatus.SUCCESS, content);

                    if (options?.paginate && content) {
                        options.paginate.setData(result, content.total || 0);
                    }

                    res.json(result);

                    if (options?.flush) {
                        for (const level of options.flush) {
                            Cache.flush(level);
                        }
                    }

                    if (options?.log && content) {
                        const id: any = content.entity?.id || content.entity?._id || content.id || content._id;

                        await Log.emit(app, req, app.config.log.collections.activity, {
                            ref: id.toHexString ? id.toHexString() : id
                        });
                    }
                }
            }
            catch (error: any) {
                next(error);
            }
        };
    }
}

export default SuccessHandler;
