declare class ServerErrorHandler {
    static handle(error: Error, port?: string | number): void;
}
export default ServerErrorHandler;
