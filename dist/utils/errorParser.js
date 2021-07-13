"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_util_module_1 = __importDefault(require("@dfgpublicidade/node-util-module"));
/* Module */
class ErrorParser {
    static parseImageUploadError(res, error, config) {
        let code;
        let message;
        switch (error) {
            case 'OUT_OF_DIMENSION': {
                message = res.lang('invalidDimensions')
                    .replace(':width', config.rules.width)
                    .replace(':height', config.rules.height);
                break;
            }
            case 'INVALID_MODE': {
                message = res.lang('invalidColorMode');
                break;
            }
        }
        return {
            code, message
        };
    }
    static parseUploadError(res, error, config) {
        let code;
        let message;
        switch (error) {
            case 'EMPTY_FILE': {
                message = res.lang('imageFileNotSent');
                break;
            }
            case 'FILE_TOO_LARGE': {
                message = res.lang('fileSizeExceeded').replace(':size', config.rules.sizeInKBytes < node_util_module_1.default.kbyteToMByteConv
                    ? `${config.rules.sizeInKBytes}Kb`
                    : (Math.round(config.rules.sizeInKBytes / node_util_module_1.default.kbyteToMByteConv)) + 'Mb');
                break;
            }
            case 'INVALID_EXTENSION': {
                message = res.lang('invalidExtension').replace(':extensions', config.rules.ext.join(', '));
                break;
            }
        }
        return {
            code, message
        };
    }
}
exports.default = ErrorParser;
