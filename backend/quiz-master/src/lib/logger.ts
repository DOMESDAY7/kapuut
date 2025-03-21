class Logger {
    private static instance: Logger;
    private logLevel: number;

    private constructor() {
        this.logLevel = 0; // Default log level
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    public setLogLevel(level: number): void {
        this.logLevel = level;
    }
    public getLogLevel(): number {
        return this.logLevel;
    }
    public log(level: number, message: string): void {
        if (level <= this.logLevel) {
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] ${message}`);
        }
    }
    public info(message: string): void {
        this.log(1, `INFO: ${message}`);
    }
    public warn(message: string): void {
        this.log(2, `WARN: ${message}`);
    }
    public error(message: string): void {
        this.log(3, `ERROR: ${message}`);
    }
    public debug(message: string): void {
        this.log(4, `DEBUG: ${message}`);
    }
    public fatal(message: string): void {
        this.log(5, `FATAL: ${message}`);
    }
}

const log = Logger.getInstance();
export default log;
