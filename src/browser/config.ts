import * as Zod from "zod";
import Pino from "pino";

type LogLevel = Zod.infer<typeof Config.LogLevel>;

class Config {
  static LogLevel = Zod.enum(["trace", "debug", "info", "warn", "error"]);

  static pino = Pino({
    level: "debug",
  });

  logger(msg: unknown, level: LogLevel = "debug"): void {
    Config.pino[level]({
      globalName: globalThis.constructor.name,
      name: this.constructor.name,
      msg,
    });
  }
}

export default Config;
