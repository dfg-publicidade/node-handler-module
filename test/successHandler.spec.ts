import App from '@dfgpublicidade/node-app-module';
import Paginate from '@dfgpublicidade/node-pagination-module';
import { HttpStatus } from '@dfgpublicidade/node-result-module';
import chai, { expect } from 'chai';
import express, { Express, NextFunction, Request, Response } from 'express';
import http from 'http';
import i18n from 'i18n';
import { after, before, describe, it } from 'mocha';
import { SuccessHandler } from '../src';

import ChaiHttp = require('chai-http');

/* Tests */
chai.use(ChaiHttp);

describe('successHandler.ts', (): void => {
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
                },
                pagination: {
                    limit: 20
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


        exp.use(i18n.init);

        exp.get('/created', async (req: Request, res: Response, next: NextFunction): Promise<void> =>
            // eslint-disable-next-line no-magic-numbers
            SuccessHandler.handle(app, { message: 'criado' }, { status: HttpStatus.created })(req, res, next)
        );

        exp.get('/success', async (req: Request, res: Response, next: NextFunction): Promise<void> =>
            SuccessHandler.handle(app, { message: 'sucesso' })(req, res, next)
        );

        exp.get('/paginated', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const paginate: Paginate = new Paginate(app, {});

            if (req.query.empty) {
                return SuccessHandler.handle(app, undefined, {
                    paginate
                })(req, res, next);
            }
            else if (req.query.total) {
                return SuccessHandler.handle(app, { items: ['test', 'test2'] }, {
                    paginate
                })(req, res, next);
            }
            else {
                return SuccessHandler.handle(app, { total: 2, items: ['test', 'test2'] }, {
                    paginate
                })(req, res, next);
            }
        });

        exp.get('/success-file', async (req: Request, res: Response, next: NextFunction): Promise<void> =>
            SuccessHandler.handle(app, 'sucesso', {
                contentType: 'text/plain',
                contentDisposition: 'inline'
            })(req, res, next)
        );

        exp.get('/success-file-2', async (req: Request, res: Response, next: NextFunction): Promise<void> =>
            SuccessHandler.handle(app, 'sucesso', {
                contentType: 'text/plain',
                contentDisposition: 'attachment',
                filename: 'text',
                ext: '.txt'
            })(req, res, next)
        );

        exp.get('/success-file-3', async (req: Request, res: Response, next: NextFunction): Promise<void> =>
            SuccessHandler.handle(app, 'sucesso', {
                contentType: 'text/plain',
                contentDisposition: 'attachment'
            })(req, res, next)
        );

        exp.get('/success-transform', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            if (req.query.empty) {
                return SuccessHandler.handle(app, undefined, {
                    transform: (item: any): any => item.toLowerCase()
                })(req, res, next);
            }
            else {
                return SuccessHandler.handle(app, { items: ['TEST', 'TEST2'] }, {
                    transform: (item: any): any => item.toLowerCase()
                })(req, res, next);
            }
        });

        exp.get('/success-transform-entity', async (req: Request, res: Response, next: NextFunction): Promise<void> => SuccessHandler.handle(app, { name: 'Test' }, {
            transform: (item: any): any => {
                item.name = item.name.toLowerCase();
            }
        })(req, res, next));

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

    it('1. SuccessHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/created');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(201);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('success');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq('criado');
    });

    it('2. SuccessHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/success');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('success');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq('sucesso');
    });

    it('3. SuccessHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/paginated');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('success');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('total').eq(2);
        expect(res.body.content).to.have.property('items').deep.eq(['test', 'test2']);
        expect(res.body.content).to.have.property('pages').eq(1);
        // eslint-disable-next-line no-magic-numbers
        expect(res.body.content).to.have.property('itemsPerPage').eq(20);
        expect(res.body.content).to.have.property('currentPage').eq(1);
    });

    it('4. SuccessHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/paginated').query({
            total: true
        });

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('success');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.not.have.property('total');
        expect(res.body.content).to.have.property('items').deep.eq(['test', 'test2']);
        expect(res.body.content).to.not.have.property('pages');
        expect(res.body.content).to.not.have.property('itemsPerPage');
        expect(res.body.content).to.not.have.property('currentPage');
    });

    it('5. SuccessHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/paginated').query({
            empty: true
        });

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('success');
        expect(res.body).to.not.have.property('content');
    });

    it('6. SuccessHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/success-file');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(200);
        expect(res.header).to.have.property('content-type').eq('text/plain; charset=utf-8');
        expect(res.header).to.have.property('content-disposition').eq('inline');
        expect(res.text).to.not.be.undefined;
        expect(res.text).to.be.eq('sucesso');
    });

    it('7. SuccessHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/success-file-2');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(200);
        expect(res.header).to.have.property('content-type').eq('text/plain; charset=utf-8');
        expect(res.header).to.have.property('content-disposition').eq('attachment; filename="text.txt"');
        expect(res.text).to.not.be.undefined;
        expect(res.text).to.be.eq('sucesso');
    });

    it('8. SuccessHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/success-file-3');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(200);
        expect(res.header).to.have.property('content-type').eq('text/plain; charset=utf-8');
        expect(res.header).to.have.property('content-disposition').eq('attachment;');
        expect(res.text).to.not.be.undefined;
        expect(res.text).to.be.eq('sucesso');
    });

    it('9. SuccessHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/success-transform').query({
            empty: true
        });

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('success');
        expect(res.body).to.not.have.property('content');
    });

    it('10. SuccessHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/success-transform');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('success');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('items').deep.eq(['test', 'test2']);
    });

    it('11. SuccessHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().get('/success-transform-entity');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('success');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('name').eq('test');
    });
});
