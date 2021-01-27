import App from '@dfgpublicidade/node-app-module';
import Log from '@dfgpublicidade/node-log-module';
import Result, { ResultStatus } from '@dfgpublicidade/node-result-module';
import appDebugger from 'debug';
import { NextFunction, Request, Response } from 'express';
import ErrorTable from '../refs/errorTable';
import HttpStatus from '../refs/httpStatus';

/* Module */
const debug: appDebugger.IDebugger = appDebugger('claretiano:nofound-handler');

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function notFoundHandle(app: App): (req: Request, res: Response, next?: NextFunction) => void {
    return async (req: Request, res: Response, next?: NextFunction): Promise<any> => {
        debug('Realizando tratamento para recurso não encontrado');

        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', '');
            res.header('Access-Control-Allow-Headers', app.config.api.allowedHeaders);
            res.end();
        }
        else {
            const result: Result = new Result(ResultStatus.ERROR, {
                code: ErrorTable.core.recursoInexistente,
                message: res.lang('recursoInexistente')
            });

            res.status(HttpStatus.notImplemented);
            res.json(result);

            await Log.emit(app, req, 'sys_nao_encontrados', {
                code: HttpStatus.notImplemented,
                error: 'Not found'
            });
        }
    };
}

export default notFoundHandle;
