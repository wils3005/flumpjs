import LogLevel from "./log-level";
import Pino from "pino";

abstract class Base {
  readonly loggerOptions: Pino.LoggerOptions = {
    level: "debug",
    name: this.constructor.name,
  };

  readonly pino = Pino(this.loggerOptions);

  constructor() {
    this.log("constructor");
  }

  log(msg: unknown, level = LogLevel.DEBUG): void {
    this.pino[level]({
      globalName: globalThis.constructor.name,
      name: this.constructor.name,
      msg,
    });
  }
}

export default Base;
