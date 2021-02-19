import LogLevel from "./log-level";
import Pino from "pino";

class Base {
  loggerOptions: Pino.LoggerOptions = {
    level: "debug",
  };

  pino = Pino(this.loggerOptions);

  log(msg: unknown, level = LogLevel.DEBUG): void {
    this.pino[level]({
      globalName: globalThis.constructor.name,
      name: this.constructor.name,
      msg,
    });
  }
}

export default Base;
