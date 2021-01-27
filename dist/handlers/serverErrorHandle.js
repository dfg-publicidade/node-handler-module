"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_util_module_1 = __importDefault(require("@dfgpublicidade/node-util-module"));
const debug_1 = __importDefault(require("debug"));
/* Module */
const debug = debug_1.default('module:servererror-handler');
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function serverErrorHandle(error, port) {
    debug('Handling server error');
    switch (error.name) {
        case 'EACCES': {
            const bind = node_util_module_1.default.parsePort(port);
            const msg = `${bind} requires elevated privileges`;
            // eslint-disable-next-line no-console
            console.error(msg);
            process.exit(1);
            break;
        }
        case 'EADDRINUSE': {
            const bind = node_util_module_1.default.parsePort(port);
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
