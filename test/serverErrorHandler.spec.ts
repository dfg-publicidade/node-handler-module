import chai, { expect } from 'chai';
import { after, before, describe, it } from 'mocha';
import * as sinon from 'sinon';
import { ServerErrorHandler } from '../src';

import ChaiHttp = require('chai-http');

/* Tests */
chai.use(ChaiHttp);

describe('serverErrorHandler.ts', (): void => {
    let logMsg: string = '';
    // eslint-disable-next-line no-console
    const err: (msg: string) => void = console.error;

    before(async (): Promise<void> => {
        sinon.stub(process, 'exit');

        // eslint-disable-next-line no-console
        console.error = (msg: string): void => {
            logMsg = msg;
        };
    });

    after(async (): Promise<void> => {
        // eslint-disable-next-line no-console
        console.error = err;
        sinon.restore();
    });

    it('1. ServerErrorHandler', async (): Promise<void> => {
        const error: Error = new Error();

        ServerErrorHandler.handle(error);

        expect(logMsg).to.be.equal(error);
        sinon.assert.called((process.exit as any));
    });

    it('2. ServerErrorHandler', async (): Promise<void> => {
        const error: Error = new Error();
        error.name = 'EACCES';
        error.message = 'listen';

        const port: number = 80;

        ServerErrorHandler.handle(error, port);

        expect(logMsg).to.be.equal(`port ${port} requires elevated privileges`);
        sinon.assert.called((process.exit as any));
    });

    it('3. ServerErrorHandler', async (): Promise<void> => {
        const error: Error = new Error();
        error.name = 'EADDRINUSE';
        error.message = 'listen';

        const port: number = 80;

        ServerErrorHandler.handle(error, port);

        expect(logMsg).to.be.equal(`port ${port} is already in use`);
        sinon.assert.called((process.exit as any));
    });
});
