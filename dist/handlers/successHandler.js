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
const node_cache_module_1 = __importDefault(require("@dfgpublicidade/node-cache-module"));
const node_log_module_1 = __importDefault(require("@dfgpublicidade/node-log-module"));
const node_result_module_1 = __importStar(require("@dfgpublicidade/node-result-module"));
const node_strings_module_1 = __importDefault(require("@dfgpublicidade/node-strings-module"));
const debug_1 = __importDefault(require("debug"));
/* Module */
const debug = debug_1.default('module:success-handler');
class SuccessHandler {
    static handle(app, content, options) {
        return async (req, res, next) => {
            debug('Handling sucess');
            res.status((options === null || options === void 0 ? void 0 : options.status) ? options.status : node_result_module_1.HttpStatus.success);
            if (options === null || options === void 0 ? void 0 : options.contentDisposition) {
                switch (options.contentDisposition) {
                    case 'inline': {
                        res.header('Content-Disposition', 'inline');
                        break;
                    }
                    case 'attachment': {
                        const filename = options.filename
                            ? `filename="${node_strings_module_1.default.toUrl(options.filename)}${options.ext}"`
                            : '';
                        res.header('Content-Disposition', `attachment; ${filename}`);
                        break;
                    }
                }
            }
            if (options === null || options === void 0 ? void 0 : options.contentType) {
                res.header('Content-Type', options.contentType);
                res.write(content);
                res.end();
            }
            else {
                const result = new node_result_module_1.default(node_result_module_1.ResultStatus.SUCCESS, content);
                if ((options === null || options === void 0 ? void 0 : options.transform) && content) {
                    if (content.items && Array.isArray(content.items)) {
                        content.items = content.items.map((item) => options.transform(item));
                    }
                    else {
                        content = options.transform(content);
                    }
                }
                if ((options === null || options === void 0 ? void 0 : options.paginate) && (content === null || content === void 0 ? void 0 : content.total)) {
                    options.paginate.setData(result, content.total);
                }
                res.json(result);
                if (options === null || options === void 0 ? void 0 : options.flush) {
                    for (const level of options.flush) {
                        node_cache_module_1.default.flush(level);
                    }
                }
                if ((options === null || options === void 0 ? void 0 : options.log) && content && (content.id || content._id)) {
                    await node_log_module_1.default.emit(app, req, app.config.log.collections.activity, {
                        ref: content.id || content._id.toHexString()
                    });
                }
            }
        };
    }
}
exports.default = SuccessHandler;
