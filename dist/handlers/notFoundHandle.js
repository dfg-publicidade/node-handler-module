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
const node_log_module_1 = __importDefault(require("@dfgpublicidade/node-log-module"));
const node_result_module_1 = __importStar(require("@dfgpublicidade/node-result-module"));
const debug_1 = __importDefault(require("debug"));
const errorTable_1 = __importDefault(require("../refs/errorTable"));
const httpStatus_1 = __importDefault(require("../refs/httpStatus"));
/* Module */
const debug = debug_1.default('claretiano:nofound-handler');
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function notFoundHandle(app) {
    return async (req, res, next) => {
        debug('Realizando tratamento para recurso não encontrado');
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', '');
            res.header('Access-Control-Allow-Headers', app.config.api.allowedHeaders);
            res.end();
        }
        else {
            const result = new node_result_module_1.default(node_result_module_1.ResultStatus.ERROR, {
                code: errorTable_1.default.core.recursoInexistente,
                message: res.lang('recursoInexistente')
            });
            res.status(httpStatus_1.default.notImplemented);
            res.json(result);
            await node_log_module_1.default.emit(app, req, 'sys_nao_encontrados', {
                code: httpStatus_1.default.notImplemented,
                error: 'Not found'
            });
        }
    };
}
exports.default = notFoundHandle;
