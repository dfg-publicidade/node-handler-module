import App from '@dfgpublicidade/node-app-module';
import chai, { expect } from 'chai';
import express, { Express, NextFunction, Request, Response } from 'express';
import http from 'http';
import i18n from 'i18n';
import { after, before, describe, it } from 'mocha';
import { InvalidRequestHandler } from '../src';

import ChaiHttp = require('chai-http');

/* Tests */
chai.use(ChaiHttp);

describe('invalidRequestHandler.ts', (): void => {
    let app: App;
    let exp: Express;
    let httpServer: http.Server;

    before(async (): Promise<void> => {
        exp = express();
        const port: number = 3000;

        exp.set('port', port);

        httpServer = http.createServer(exp);

        app = new App({
            appInfo: {
                name: 'test',
                version: 'v1'
            },
            config: {
                api: {
                    allowedHeaders: ''
                }
            }
        });

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

        exp.get('/invalid-request', async (req: Request, res: Response, next: NextFunction): Promise<void> =>
            InvalidRequestHandler.handle(app, 'dadosInvalidos')(req, res, next)
        );

        exp.use(i18n.init);

        exp.get('/invalid-request/lang', async (req: Request, res: Response, next: NextFunction): Promise<void> =>
            InvalidRequestHandler.handle(app, 'dadosInvalidos')(req, res, next)
        );

        exp.get('/invalid-request-message', async (req: Request, res: Response, next: NextFunction): Promise<void> =>
            InvalidRequestHandler.handle(app, 'dadosInvalidos', [{
                message: 'Nome não informado'
            }])(req, res, next)
        );

        exp.get('/invalid-media', async (req: Request, res: Response, next: NextFunction): Promise<void> =>
            InvalidRequestHandler.handle(app, 'dadosInvalidos', [{
                message: 'Formato de mídia não suportado'
                // eslint-disable-next-line no-magic-numbers
            }], 415)(req, res, next)
        );

        exp.get('/invalid-request/fail', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            res.end();

            InvalidRequestHandler.handle(app, 'dadosInvalidos', [{
                message: 'Nome não informado'
            }])(req, res, next);
        });

        return new Promise<void>((
            resolve: () => void
        ): void => {
            httpServer.listen(port, (): void => {
                resolve();
            });
        });
    });

    after(async (): Promise<void> => new Promise<void>((
        resolve: () => void
    ): void => {
        httpServer.close((): void => {
            resolve();
        });
    }));

    it('1. handle', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/invalid-request');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(400);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq('Invalid request');
    });

    it('2. handle', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/invalid-request/lang');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(400);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq('dadosInvalidos');
    });

    it('3. handle', async (): Promise<void> => {
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

    it('4. handle', async (): Promise<void> => {
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

    it('5. handle', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/invalid-request/fail');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(200);
    });
});
