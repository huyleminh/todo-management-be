import * as moment from "moment";
import * as winston from "winston";
import "winston-daily-rotate-file";
import Config from "../../configs/config";

const transport = new winston.transports.DailyRotateFile({
    filename: "app-%DATE%",
    extension: ".log",
    dirname: "logs",
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
});

const msgFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] : [${level}] : ${message}`;
});

const transportList: any[] = [new winston.transports.Console()];
if (Config.APP.ENV === "dev") {
    transportList.push(transport);
}
const Logger = winston.createLogger({
    transports: transportList,
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
