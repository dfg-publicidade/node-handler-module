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
const errorParser_1 = __importDefault(require("../utils/errorParser"));
/* Module */
const debug = (0, debug_1.default)('module:invalid-request-handler');
class InvalidUploadHandler {
    static handle(app, upload, error) {
        return async (req, res, next) => {
            try {
                debug('Handling invalid upload');
                const result = new node_result_module_1.default(node_result_module_1.ResultStatus.WARNING, (error === 'OUT_OF_DIMENSION' || error === 'INVALID_MODE')
                    ? errorParser_1.default.parseImageUploadError(res, upload, error)
                    : errorParser_1.default.parseUploadError(res, upload, error));
                res.status(node_result_module_1.HttpStatus.badRequest);
                res.json(result);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = InvalidUploadHandler;
