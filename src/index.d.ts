/* eslint-disable no-unused-vars */
declare namespace Express {
    interface Response {
        lang: (key: string) => string;
        langN: (key: string) => string;
    }
}
