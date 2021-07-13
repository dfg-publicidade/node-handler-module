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

    public static parseUploadError(res: Response, error: UploadError, config: any): {
        code: string;
        message: string;
    } {
        let code: string;
        let message: string;

        switch (error) {
            case 'EMPTY_FILE': {
                message = res.lang
                    ? res.lang('imageFileNotSent')
                    : 'File not sent';

                break;
            }
            case 'FILE_TOO_LARGE': {
                message = res.lang
                    ? res.lang('fileSizeExceeded').replace(':size',
                        config.rules.sizeInKBytes < Util.kbyteToMByteConv
                            ? `${config.rules.sizeInKBytes}Kb`
                            : (Math.round(config.rules.sizeInKBytes / Util.kbyteToMByteConv)) + 'Mb'
                    )
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

export default ErrorParser;
