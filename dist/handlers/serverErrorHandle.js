"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const util_1 = __importDefault(require("../utils/util"));
/* Module */
const debug = debug_1.default('claretiano:servererror-handler');
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function serverErrorHandle(error, port) {
    debug('Realizando tratamento de erro fatal');
    switch (error.name) {
        case 'EACCES': {
            const bind = util_1.default.parsePort(port);
            const msg = `${bind} requires elevated privileges`;
            // eslint-disable-next-line no-console
            console.error(msg);
            process.exit(1);
            break;
        }
        case 'EADDRINUSE': {
            const bind = util_1.default.parsePort(port);
            const msg = `${bind} is already in use`;
            // eslint-disable-next-line no-console
            console.error(msg);
            process.exit(1);
            break;
        }
        default: {
            // eslint-disable-next-line no-console
            console.error(error);
            process.exit(1);
        }
    }
}
exports.default = serverErrorHandle;
