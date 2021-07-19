"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_util_module_1 = __importDefault(require("@dfgpublicidade/node-util-module"));
/* Module */
class ErrorParser {
    static parseImageUploadError(res, upload, error) {
        let code;
        let message;
        switch (error) {
            case 'OUT_OF_DIMENSION': {
                message = res.lang
                    ? res.lang('invalidDimensions')
                        .replace(':width', upload.getDefaultWidth().toString())
                        .replace(':height', upload.getDefaultHeight().toString())
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
    static parseUploadError(res, upload, error) {
        let code;
        let message;
        switch (error) {
            case 'EMPTY_FILE': {
                message = res.lang
                    ? res.lang('fileNotSent')
                    : 'File not sent';
                break;
            }
            case 'FILE_TOO_LARGE': {
                message = res.lang
                    ? res.lang('fileSizeExceeded').replace(':size', upload.getMaxSizeInKBytes() < node_util_module_1.default.kbyteToMByteConv
                        ? `${upload.getMaxSizeInKBytes()}Kb`
                        : (Math.round(upload.getMaxSizeInKBytes() / node_util_module_1.default.kbyteToMByteConv)) + 'Mb')
                    : 'File too large';
                break;
            }
            case 'INVALID_EXTENSION': {
                message = res.lang
                    ? res.lang('invalidExtension').replace(':extensions', upload.getAcceptedExt().join(', '))
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
