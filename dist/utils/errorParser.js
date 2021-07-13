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
                message = res.lang
                    ? res.lang('invalidDimensions')
                        .replace(':width', config.rules.width)
                        .replace(':height', config.rules.height)
                    : 'Out of dimension';
                break;
            }
            case 'INVALID_MODE': {
                message = res.lang
                    ? res.lang('invalidColorMode')
                    : 'Invalid color mode';
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
                message = res.lang
                    ? res.lang('imageFileNotSent')
                    : 'File not sent';
                break;
            }
            case 'FILE_TOO_LARGE': {
                message = res.lang
                    ? res.lang('fileSizeExceeded').replace(':size', config.rules.sizeInKBytes < node_util_module_1.default.kbyteToMByteConv
                        ? `${config.rules.sizeInKBytes}Kb`
                        : (Math.round(config.rules.sizeInKBytes / node_util_module_1.default.kbyteToMByteConv)) + 'Mb')
                    : 'File too large';
                break;
            }
            case 'INVALID_EXTENSION': {
                message = res.lang
                    ? res.lang('invalidExtension').replace(':extensions', config.rules.ext.join(', '))
                    : 'Invalid extension';
                break;
            }
        }
        return {
            code, message
        };
    }
}
exports.default = ErrorParser;
