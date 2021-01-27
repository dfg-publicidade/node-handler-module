import App from '@dfgpublicidade/node-app-module';
import Log from '@dfgpublicidade/node-log-module';
import Result, { ResultStatus } from '@dfgpublicidade/node-result-module';
import appDebugger from 'debug';
import { NextFunction, Request, Response } from 'express';
import ErrorTable from '../refs/errorTable';
import HttpStatus from '../refs/httpStatus';

/* Module */
const debug: appDebugger.IDebugger = appDebugger('nodule:error-handler');

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function errorHandle(app: App): (error: any, req: Request, res: Response, next: NextFunction) => void {
    return async (error: any, req: Request, res: Response, next: NextFunction): Promise<any> => {
        debug('Realizando tratamento de erro');

        const status: number = error.status || HttpStatus.internalError;

        const result: Result = new Result(ResultStatus.ERROR, {
            code: ErrorTable.core.erroInterno,
            message: res.lang('erroInterno'),
            error: error.message
        });

        res.status(status);
        res.json(result);

        await Log.emit(app, req, 'sys_erros', {
            code: status,
            error: error.message
        });

        // eslint-disable-next-line no-console
        console.error(error);
    };
}

export default errorHandle;
