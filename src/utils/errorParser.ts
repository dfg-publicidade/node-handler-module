import { ImageUploadError, UploadError } from '@dfgpublicidade/node-upload-module';
import Util from '@dfgpublicidade/node-util-module';
import { Response } from 'express';

/* Module */
class ErrorParser {
    public static parseImageUploadError(res: Response, error: ImageUploadError, config: any): {
        code: string;
        message: string;
    } {
        let code: string;
        let message: string;

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

    public static parseUploadError(res: Response, error: UploadError, config: any): {
        code: string;
        message: string;
    } {
        let code: string;
        let message: string;

        switch (error) {
            case 'EMPTY_FILE': {
                message = res.lang('imageFileNotSent');

                break;
            }
            case 'FILE_TOO_LARGE': {
                message = res.lang('fileSizeExceeded').replace(':size',
                    config.rules.sizeInKBytes < Util.kbyteToMByteConv
                        ? `${config.rules.sizeInKBytes}Kb`
                        : (Math.round(config.rules.sizeInKBytes / Util.kbyteToMByteConv)) + 'Mb'
                );

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

export default ErrorParser;
