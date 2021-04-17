import App from '@dfgpublicidade/node-app-module';
import chai, { expect } from 'chai';
import express, { Express, NextFunction, Request, Response } from 'express';
import http from 'http';
import { after, before, describe, it } from 'mocha';
import { Db, MongoClient } from 'mongodb';
import { errorHandle, notFoundHandle } from '../src';
import ChaiHttp = require('chai-http');

/* Tests */
chai.use(ChaiHttp);

describe('index.ts', (): void => {
    let app: App;
    let exp: Express;
    let httpServer: http.Server;
    let client: MongoClient;
    let db: Db;

    // eslint-disable-next-line no-console
    const err: (msg: string) => void = console.error;
    let logMsg: string = '';

    const errorCollection: string = 'test_error_col';
    const notfoundCollection: string = 'notfound_error_col';

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

        exp.get('/error', async (req: Request, res: Response): Promise<void> => {
            throw Error('Test error');
        });

        exp.use(notFoundHandle(app, '0000', 'recursoInexistente'));
        exp.use(errorHandle(app, '0001', 'erroInterno'));

        return new Promise<void>((
            resolve: () => void
        ): void => {
            httpServer.listen(port, (): void => {
                resolve();
            });
        });
    });

    after(async (): Promise<void> => {
        // eslint-disable-next-line no-console
        console.error = err;

        try {
            await db.collection(errorCollection).drop();
            await db.collection(notfoundCollection).drop();

            client.close();
        }
        catch (error) {
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

    it('1. errorHandle', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/error');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(500);
    });
});
