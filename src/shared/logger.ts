import * as Zod from "zod";
import Pino from "pino";

type LogLevel = Zod.infer<typeof Logger.LogLevel>;

class Logger {
  static LogLevel = Zod.enum(["trace", "debug", "info", "warn", "error"]);

  static pino = Pino({
    level: "debug",
  });

  static log(msg: unknown, level: LogLevel = "debug"): void {
    Logger.pino[level]({
      globalName: globalThis.constructor.name,
      name: this.constructor.name,
      msg,
    });
  }
}

export default Logger;
