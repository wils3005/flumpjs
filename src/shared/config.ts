import * as Zod from "zod";
import Pino from "pino";

type LogLevel = Zod.infer<typeof Config.LogLevel>;

class Config {
  static LogLevel = Zod.enum(["trace", "debug", "info", "warn", "error"]);

  static pino = Pino({
    level: "debug",
  });

  static globalName = globalThis.constructor.name;

  log(msg: unknown, level: LogLevel = "debug"): void {
    Config.pino[level]({
      globalName: Config.globalName,
      name: this.constructor.name,
      msg,
    });
  }

  constructor() {
    this.log("constructor");
  }
}

export { Config };
