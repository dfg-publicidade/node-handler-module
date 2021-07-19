import App from '@dfgpublicidade/node-app-module';
import { FileUpload, ImageUpload } from '@dfgpublicidade/node-upload-module';
import chai, { expect } from 'chai';
import express, { Express, NextFunction, Request, Response } from 'express';
import http from 'http';
import i18n from 'i18n';
import { after, before, describe, it } from 'mocha';
import InvalidUploadHandler from '../src/handlers/invalidUploadHandler';

import ChaiHttp = require('chai-http');

/* Tests */
chai.use(ChaiHttp);

describe('invalidUploadHandler.ts', (): void => {
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

        exp.post('/empty-file', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const upload: FileUpload = new FileUpload(app.config, {
                name: '',
                prefix: '',
                rules: {}
            });

            return InvalidUploadHandler.handle(app, upload, 'EMPTY_FILE')(req, res, next);
        });

        exp.post('/file-too-large', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const upload: FileUpload = new FileUpload(app.config, {
                name: '',
                prefix: '',
                rules: {
                    sizeInKBytes: 100
                }
            });

            return InvalidUploadHandler.handle(app, upload, 'FILE_TOO_LARGE')(req, res, next);
        });

        exp.post('/file-too-large-2', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const upload: FileUpload = new FileUpload(app.config, {
                name: '',
                prefix: '',
                rules: {
                    sizeInKBytes: 5000
                }
            });

            return InvalidUploadHandler.handle(app, upload, 'FILE_TOO_LARGE')(req, res, next);
        });

        exp.post('/invalid-extension', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const upload: FileUpload = new FileUpload(app.config, {
                name: '',
                prefix: '',
                rules: {
                    ext: ['.doc', '.docx', '.pdf']
                }
            });

            return InvalidUploadHandler.handle(app, upload, 'INVALID_EXTENSION')(req, res, next);
        });

        exp.post('/out-of-dimension', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const upload: ImageUpload = new ImageUpload(app.config, {
                name: '',
                prefix: '',
                rules: {
                    width: 150,
                    height: 150
                }
            });

            return InvalidUploadHandler.handle(app, upload, 'OUT_OF_DIMENSION')(req, res, next);
        });

        exp.post('/invalid-mode', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const upload: ImageUpload = new ImageUpload(app.config, {
                name: '',
                prefix: '',
                rules: {}
            });

            return InvalidUploadHandler.handle(app, upload, 'INVALID_MODE')(req, res, next);
        });

        exp.use(i18n.init);

        exp.post('/empty-file/lang', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const upload: FileUpload = new FileUpload(app.config, {
                name: '',
                prefix: '',
                rules: {}
            });

            return InvalidUploadHandler.handle(app, upload, 'EMPTY_FILE')(req, res, next);
        });

        exp.post('/file-too-large/lang', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const upload: FileUpload = new FileUpload(app.config, {
                name: '',
                prefix: '',
                rules: {
                    sizeInKBytes: 100
                }
            });

            return InvalidUploadHandler.handle(app, upload, 'FILE_TOO_LARGE')(req, res, next);
        });

        exp.post('/file-too-large-2/lang', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const upload: FileUpload = new FileUpload(app.config, {
                name: '',
                prefix: '',
                rules: {
                    sizeInKBytes: 5000
                }
            });

            return InvalidUploadHandler.handle(app, upload, 'FILE_TOO_LARGE')(req, res, next);
        });

        exp.post('/invalid-extension/lang', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const upload: FileUpload = new FileUpload(app.config, {
                name: '',
                prefix: '',
                rules: {
                    ext: ['.doc', '.docx', '.pdf']
                }
            });

            return InvalidUploadHandler.handle(app, upload, 'INVALID_EXTENSION')(req, res, next);
        });

        exp.post('/out-of-dimension/lang', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const upload: ImageUpload = new ImageUpload(app.config, {
                name: '',
                prefix: '',
                rules: {
                    width: 150,
                    height: 150
                }
            });

            return InvalidUploadHandler.handle(app, upload, 'OUT_OF_DIMENSION')(req, res, next);
        });

        exp.post('/invalid-mode/lang', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const upload: ImageUpload = new ImageUpload(app.config, {
                name: '',
                prefix: '',
                rules: {}
            });

            return InvalidUploadHandler.handle(app, upload, 'INVALID_MODE')(req, res, next);
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

    it('1. InvalidUploadHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().post('/empty-file');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(400);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq('File not sent');
    });

    it('2. InvalidUploadHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().post('/empty-file/lang');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(400);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq(i18n.__('fileNotSent'));
    });

    it('3. InvalidUploadHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().post('/file-too-large');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(400);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq('File too large');
    });

    it('4. InvalidUploadHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().post('/file-too-large/lang');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(400);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq(i18n.__('fileSizeExceeded').replace(':size', '100Kb'));
    });

    it('5. InvalidUploadHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().post('/file-too-large-2/lang');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(400);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq(i18n.__('fileSizeExceeded').replace(':size', '5Mb'));
    });

    it('6. InvalidUploadHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().post('/invalid-extension');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(400);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq('Invalid extension');
    });

    it('7. InvalidUploadHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().post('/invalid-extension/lang');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(400);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq(i18n.__('invalidExtension').replace(':extensions', '.doc, .docx, .pdf'));
    });

    it('8. InvalidUploadHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().post('/out-of-dimension');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(400);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq('Out of dimension');
    });

    it('9. InvalidUploadHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().post('/out-of-dimension/lang');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(400);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq(i18n.__('invalidDimensions').replace(':width', '150').replace(':height', '150'));
    });

    it('10. InvalidUploadHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().post('/invalid-mode');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(400);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq('Invalid color mode');
    });

    it('11. InvalidUploadHandler', async (): Promise<void> => {
        const res: ChaiHttp.Response = await chai.request(exp).keepOpen().post('/invalid-mode/lang');

        // eslint-disable-next-line no-magic-numbers
        expect(res).to.have.status(400);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.property('time');
        expect(res.body).to.have.property('status').eq('warning');
        expect(res.body).to.have.property('content');
        expect(res.body.content).to.have.property('message').eq(i18n.__('invalidColorMode'));
    });
});
