import { FileUpload, ImageUpload, ImageUploadError, UploadError } from '@dfgpublicidade/node-upload-module';
import Util from '@dfgpublicidade/node-util-module';
import { Response } from 'express';

/* Module */
class ErrorParser {
    public static parseImageUploadError(res: Response, upload: ImageUpload, error: ImageUploadError): {
        code: string;
        message: string;
    } {
        let code: string;
        let message: string;

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

    public static parseUploadError(res: Response, upload: FileUpload, error: UploadError): {
        code: string;
        message: string;
    } {
        let code: string;
        let message: string;

        switch (error) {
            case 'EMPTY_FILE': {
                message = res.lang
                    ? res.lang('fileNotSent')
                    : 'File not sent';

                break;
            }
            case 'FILE_TOO_LARGE': {
                message = res.lang
                    ? res.lang('fileSizeExceeded').replace(':size',
                        upload.getMaxSizeInKBytes() < Util.kbyteToMByteConv
                            ? `${upload.getMaxSizeInKBytes()}Kb`
                            : (Math.round(upload.getMaxSizeInKBytes() / Util.kbyteToMByteConv)) + 'Mb'
                    )
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

export default ErrorParser;
