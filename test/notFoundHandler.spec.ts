import App from '@dfgpublicidade/node-app-module';
import chai, { expect } from 'chai';
import express, { Express, NextFunction, Request, Response } from 'express';
import http from 'http';
import i18n from 'i18n';
import { after, before, describe, it } from 'mocha';
import { Db, MongoClient } from 'mongodb';
import { NotFoundHandler } from '../src';

import ChaiHttp = require('chai-http');

/* Tests */
chai.use(ChaiHttp);

describe('notFoundHandler.ts', (): void => {
    let app: App;
    let exp: Express;
    let httpServer: http.Server;
    let client: MongoClient;
    let db: Db;

    const notfoundCollection: string = 'notfound_error_col';

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
                        notFound: notfoundCollection
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

        exp.get('/id', async (req: Request, res: Response, next: NextFunction): Promise<void> =>
            // eslint-disable-next-line no-magic-numbers
            NotFoundHandler.handle(app, 'registroNaoEncontrado', 404)(req, res, next)
        );

        exp.use(i18n.init);

        exp.get('/id/lang', async (req: Request, res: Response, next: NextFunction): Promise<void> =>
            // eslint-disable-next-line no-magic-numbers
            NotFoundHandler.handle(app, 'registroNaoEncontrado', 404)(req, res, next)
        );

        exp.use(NotFoundHandler.handle(app, 'recursoInexistente'));

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
            await db.collection(notfoundCollection).drop();
        }
        catch (error: any) {
            //
        }

        return new Promise<void>((
            resolve: () => void
        ): void => {
            httpServer.close((): void => {
                resolve();
            });
        });
    });


    it('1. NotFoundHandler', async (): Promise<void> => {
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

    it('2. NotFoundHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().options('/notfound');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(200);
        expect(res.header).to.not.be.undefined;
        expect(res.header).to.have.property('access-control-allow-methods').eq('');
        expect(res.header).to.have.property('access-control-allow-headers').eq(app.config.api.allowedHeaders);
    });

    it('3. NotFoundHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/id');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(404);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq('Not found');

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

    it('4. NotFoundHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/id/lang');

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
});
