"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_result_module_1 = __importStar(require("@dfgpublicidade/node-result-module"));
const debug_1 = __importDefault(require("debug"));
/* Module */
const debug = debug_1.default('module:invalid-request-handler');
class InvalidRequestHandler {
    static handle(app, messageKey, errors, status) {
        return async (req, res, next) => {
            debug('Handling invalid request');
            const result = new node_result_module_1.default(node_result_module_1.ResultStatus.WARNING, {
                message: res.lang ? res.lang(messageKey) : 'Invalid request',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                errors_validation: errors === null || errors === void 0 ? void 0 : errors.map((error) => error.message)
            });
            res.status(status ? status : node_result_module_1.HttpStatus.badRequest);
            res.json(result);
        };
    }
}
exports.default = InvalidRequestHandler;
