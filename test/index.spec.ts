import App from '@dfgpublicidade/node-app-module';
import chai, { expect } from 'chai';
import express, { Express, NextFunction, Request, Response } from 'express';
import http from 'http';
import { after, before, describe, it } from 'mocha';
import { Db, MongoClient } from 'mongodb';
import * as sinon from 'sinon';
import { errorHandle, notFoundHandle, serverErrorHandle } from '../src';
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

        httpServer = http.createServer(express);

        if (!process.env.MONGO_TEST_URL) {
            throw new Error('MONGO_TEST_URL must be set');
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
            },
            connectionName: '',
            db
        });

        exp.use((req: Request, res: Response, next: NextFunction): void => {
            res.lang = (key: string): string => key;

            next();
        });

        exp.get('/error', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            next(new Error('Test error'));
        });

        exp.use(notFoundHandle(app, '0000', 'recursoInexistente'));
        exp.use(errorHandle(app, '0001', 'erroInterno'));

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
            await db.collection(notfoundCollection).drop();

            client.close();
        }
        catch (error) {
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

    it('1. errorHandle', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/error');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(500);
        expect(res.body).to.not.be.empty;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('error');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('code').eq('0001');
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

    it('2. notFoundHandle', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/notfound');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(501);
        expect(res.body).to.not.be.empty;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('error');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('code').eq('0000');
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

    it('3. notFoundHandle', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().options('/notfound');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(200);
        expect(res.header).to.not.be.empty;
        expect(res.header).to.have.property('access-control-allow-methods').eq('');
        expect(res.header).to.have.property('access-control-allow-headers').eq(app.config.api.allowedHeaders);
    });

    it('4. serverErrorHandle', async (): Promise<void> => {
        const error: Error = new Error();

        serverErrorHandle(error);

        expect(logMsg).to.be.equal(error);
        sinon.assert.called((process.exit as any));
    });

    it('5. serverErrorHandle', async (): Promise<void> => {
        const error: Error = new Error();
        error.name = 'EACCES';
        error.message = 'listen';

        const port: number = 80;

        serverErrorHandle(error, port);

        expect(logMsg).to.be.equal(`port ${port} requires elevated privileges`);
        sinon.assert.called((process.exit as any));
    });

    it('6. serverErrorHandle', async (): Promise<void> => {
        const error: Error = new Error();
        error.name = 'EADDRINUSE';
        error.message = 'listen';

        const port: number = 80;

        serverErrorHandle(error, port);

        expect(logMsg).to.be.equal(`port ${port} is already in use`);
        sinon.assert.called((process.exit as any));
    });
});
