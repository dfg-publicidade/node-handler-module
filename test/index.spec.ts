import App from '@dfgpublicidade/node-app-module';
import chai, { expect } from 'chai';
import express, { Express, NextFunction, Request, Response } from 'express';
import http from 'http';
import i18n from 'i18n';
import { after, before, describe, it } from 'mocha';
import { Db, MongoClient } from 'mongodb';
import * as sinon from 'sinon';
import { ErrorHandler, InvalidRequestHandler, NotFoundHandler, ServerErrorHandler, SuccessHandle } from '../src';
import InvalidUploadHandler from '../src/handlers/invalidUploadHandler';

import ChaiHttp = require('chai-http');

/* Tests */
chai.use(ChaiHttp);

describe('index.ts', (): void => {
    let app: App;
    let exp: Express;
    let httpServer: http.Server;
    let client: MongoClient;
    let db: Db;

    const errorCollection: string = 'test_error_col';
    const notfoundCollection: string = 'notfound_error_col';

    let logMsg: string = '';
    // eslint-disable-next-line no-console
    const err: (msg: string) => void = console.error;

    before(async (): Promise<void> => {
        exp = express();
        const port: number = 3000;

        exp.set('port', port);

        httpServer = http.createServer(exp);

        if (!process.env.MONGO_TEST_URL) {
            throw new Error('MONGO_TEST_URL must be set.');
        }

        client = await MongoClient.connect(process.env.MONGO_TEST_URL, {
            poolSize: 1,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        db = client.db();

        app = new App({
            appInfo: {
                name: 'test',
                version: 'v1'
            },
            config: {
                api: {
                    allowedHeaders: ''
                },
                log: {
                    collections: {
                        notFound: notfoundCollection,
                        error: errorCollection
                    }
                }
            }
        });

        app.add('db', db);

        i18n.configure({
            defaultLocale: 'pt-BR',
            locales: ['pt-BR'],
            directory: 'test/lang',
            autoReload: true,
            updateFiles: false,
            api: {
                __: 'lang',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                __n: 'langN'
            }
        });

        exp.use(i18n.init);

        exp.get('/error', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            next(new Error('Test error'));
        });

        exp.get('/id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            // eslint-disable-next-line no-magic-numbers
            NotFoundHandler.handle(app, 'registroNaoEncontrado', 404)(req, res, next);
        });

        exp.get('/invalid-request', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            InvalidRequestHandler.handle(app, 'dadosInvalidos')(req, res, next);
        });

        exp.get('/invalid-request-message', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            InvalidRequestHandler.handle(app, 'dadosInvalidos', [{
                message: 'Nome não informado'
            }])(req, res, next);
        });

        exp.get('/invalid-media', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            InvalidRequestHandler.handle(app, 'dadosInvalidos', [{
                message: 'Formato de mídia não suportado'
                // eslint-disable-next-line no-magic-numbers
            }], 415)(req, res, next);
        });

        exp.get('/created', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            // eslint-disable-next-line no-magic-numbers
            SuccessHandle.handle(app, 'criado', 201)(req, res, next);
        });

        exp.get('/success', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            SuccessHandle.handle(app, 'sucesso')(req, res, next);
        });

        exp.post('/empty-file', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            InvalidUploadHandler.handle(app, 'EMPTY_FILE', {})(req, res, next);
        });

        exp.post('/file-too-large', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            InvalidUploadHandler.handle(app, 'FILE_TOO_LARGE', {
                rules: {
                    sizeInKBytes: 100
                }
            })(req, res, next);
        });

        exp.post('/file-too-large-2', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            InvalidUploadHandler.handle(app, 'FILE_TOO_LARGE', {
                rules: {
                    sizeInKBytes: 5000
                }
            })(req, res, next);
        });

        exp.post('/invalid-extension', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            InvalidUploadHandler.handle(app, 'INVALID_EXTENSION', {
                rules: {
                    ext: ['.doc', '.docx', '.pdf']
                }
            })(req, res, next);
        });

        exp.post('/out-of-dimension', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            InvalidUploadHandler.handle(app, 'OUT_OF_DIMENSION', {
                rules: {
                    width: 150,
                    height: 150
                }
            })(req, res, next);
        });

        exp.post('/invalid-mode', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            InvalidUploadHandler.handle(app, 'INVALID_MODE', {})(req, res, next);
        });

        exp.use(NotFoundHandler.handle(app, 'recursoInexistente'));
        exp.use(ErrorHandler.handle(app, 'erroInterno'));

        sinon.stub(process, 'exit');

        // eslint-disable-next-line no-console
        console.error = (msg: string): void => {
            logMsg = msg;
        };

        return new Promise<void>((
            resolve: () => void
        ): void => {
            httpServer.listen(port, (): void => {
                resolve();
            });
        });
    });

    after(async (): Promise<void> => {
        try {
            await db.collection(errorCollection).drop();
        }
        catch (error: any) {
            //
        }

        try {
            await db.collection(notfoundCollection).drop();
        }
        catch (error: any) {
            //
        }

        // eslint-disable-next-line no-console
        console.error = err;
        sinon.restore();

        return new Promise<void>((
            resolve: () => void
        ): void => {
            httpServer.close((): void => {
                resolve();
            });
        });
    });

    it('1. ErrorHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/error');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(500);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('error');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq('erroInterno');
        expect(res.body.content).to.have.property('error').eq('Test error');

        const log: any = await db.collection(errorCollection).findOne({});

        expect(log).exist.and.have.property('app');
        expect(log).exist.and.have.property('request');
        expect(log).exist.and.have.property('action').eq('/error');
        expect(log).exist.and.have.property('method').eq('GET');
        expect(log).exist.and.have.property('ip');
        expect(log).exist.and.have.property('content')
            // eslint-disable-next-line no-magic-numbers
            .which.have.property('code').eq(500);
        expect(log).exist.and.have.property('content')
            .which.have.property('error').eq('Test error');
        expect(log).exist.and.have.property('time');

        await db.collection(errorCollection).drop();
    });

    it('2. NotFoundHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/notfound');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(501);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq('recursoInexistente');

        const log: any = await db.collection(notfoundCollection).findOne({});

        expect(log).exist.and.have.property('app');
        expect(log).exist.and.have.property('request');
        expect(log).exist.and.have.property('action').eq('/notfound');
        expect(log).exist.and.have.property('method').eq('GET');
        expect(log).exist.and.have.property('ip');
        expect(log).exist.and.have.property('content')
            // eslint-disable-next-line no-magic-numbers
            .which.have.property('code').eq(501);
        expect(log).exist.and.have.property('content')
            .which.have.property('error').eq('Not found');
        expect(log).exist.and.have.property('time');

        await db.collection(notfoundCollection).drop();
    });

    it('3. NotFoundHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().options('/notfound');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(200);
        expect(res.header).to.not.be.undefined;
        expect(res.header).to.have.property('access-control-allow-methods').eq('');
        expect(res.header).to.have.property('access-control-allow-headers').eq(app.config.api.allowedHeaders);
    });

    it('4. NotFoundHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/id');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(404);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq('registroNaoEncontrado');

        const log: any = await db.collection(notfoundCollection).findOne({});

        expect(log).exist.and.have.property('app');
        expect(log).exist.and.have.property('request');
        expect(log).exist.and.have.property('action').eq('/id');
        expect(log).exist.and.have.property('method').eq('GET');
        expect(log).exist.and.have.property('ip');
        expect(log).exist.and.have.property('content')
            // eslint-disable-next-line no-magic-numbers
            .which.have.property('code').eq(404);
        expect(log).exist.and.have.property('content')
            .which.have.property('error').eq('Not found');
        expect(log).exist.and.have.property('time');

        await db.collection(notfoundCollection).drop();
    });

    it('5. InvalidRequestHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/invalid-request');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(400);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq('dadosInvalidos');
    });

    it('5. InvalidRequestHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/invalid-request-message');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(400);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq('dadosInvalidos');

        expect(res.body.content.errors_validation).to.be.not.empty;
        expect(res.body.content.errors_validation[0]).to.be.eq('Nome não informado');
    });

    it('6. InvalidRequestHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/invalid-media');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(415);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq('dadosInvalidos');

        expect(res.body.content.errors_validation).to.be.not.empty;
        expect(res.body.content.errors_validation[0]).to.be.eq('Formato de mídia não suportado');
    });

    it('7. SuccessHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/created');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(201);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('success');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq('criado');
    });

    it('8. SuccessHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/success');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('success');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq('sucesso');
    });

    it('6. InvalidRequestHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/invalid-media');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(415);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq('dadosInvalidos');

        expect(res.body.content.errors_validation).to.be.not.empty;
        expect(res.body.content.errors_validation[0]).to.be.eq('Formato de mídia não suportado');
    });

    it('7. InvalidUploadHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().post('/empty-file');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(400);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq(i18n.__('imageFileNotSent'));
    });

    it('8. InvalidUploadHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().post('/file-too-large');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(400);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq(i18n.__('fileSizeExceeded').replace(':size', '100Kb'));
    });

    it('9. InvalidUploadHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().post('/file-too-large-2');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(400);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq(i18n.__('fileSizeExceeded').replace(':size', '5Mb'));
    });

    it('10. InvalidUploadHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().post('/invalid-extension');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(400);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq(i18n.__('invalidExtension').replace(':extensions', '.doc, .docx, .pdf'));
    });

    it('11. InvalidUploadHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().post('/out-of-dimension');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(400);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq(i18n.__('invalidDimensions').replace(':width', '150').replace(':height', '150'));
    });

    it('12. InvalidUploadHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().post('/invalid-mode');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(400);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq(i18n.__('invalidColorMode'));
    });

    it('13. ServerErrorHandler', async (): Promise<void> => {
        const error: Error = new Error();

        ServerErrorHandler.handle(error);

        expect(logMsg).to.be.equal(error);
        sinon.assert.called((process.exit as any));
    });

    it('14. ServerErrorHandler', async (): Promise<void> => {
        const error: Error = new Error();
        error.name = 'EACCES';
        error.message = 'listen';

        const port: number = 80;

        ServerErrorHandler.handle(error, port);

        expect(logMsg).to.be.equal(`port ${port} requires elevated privileges`);
        sinon.assert.called((process.exit as any));
    });

    it('15. ServerErrorHandler', async (): Promise<void> => {
        const error: Error = new Error();
        error.name = 'EADDRINUSE';
        error.message = 'listen';

        const port: number = 80;

        ServerErrorHandler.handle(error, port);

        expect(logMsg).to.be.equal(`port ${port} is already in use`);
        sinon.assert.called((process.exit as any));
    });
});
