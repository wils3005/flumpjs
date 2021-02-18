import * as Zod from "zod";
import Base from "./base";
import Express from "express";
import ExpressPinoLogger from "express-pino-logger";

class ExpressWrapper extends Base {
  readonly env = Zod.object({
    STATIC_PATH: Zod.string(),
  }).parse(process.env);

  readonly express: Express.Express = Express();

  constructor() {
    super();
    this.express.use(ExpressPinoLogger({ logger: this.pino }));
    this.express.use(Express.static(this.env.STATIC_PATH));
    this.express.on("mount", () => this.mount());
  }

  mount(): void {
    this.log("mount");
  }
}

export default ExpressWrapper;
