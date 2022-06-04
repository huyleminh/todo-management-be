import * as moment from "moment";
import * as winston from "winston";
import "winston-daily-rotate-file";

const transport = new winston.transports.DailyRotateFile({
    filename: "app-%DATE%",
    extension: ".log",
    dirname: "logs",
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
});

const msgFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] : [${level}] : ${message}\r\n`;
});

const Logger = winston.createLogger({
    transports: [transport, new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.timestamp({
            format: () => {
                return moment(new Date()).format("YYYY-MM-DD HH:mm:ss.SSS ZZ");
            },
        }),
        msgFormat
    ),
});

class AppLogStream {
    write(msg: string) {
        Logger.info(msg);
    }
}

export { transport, Logger, AppLogStream };
