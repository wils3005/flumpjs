import BroadcastChannelManager from "./broadcast-channel-manager";
import DatabaseManager from "./database-manager";
import Pino from "pino";

declare type LogLevel = Zod.infer<typeof BrowserApplication.LogLevel>;

declare class BrowserApplication {
  static LogLevel: Zod.ZodEnum<["trace", "debug", "info", "warn", "error"]>;
  static pino: Pino.Logger;
  bcManager: BroadcastChannelManager;
  databaseManager: DatabaseManager;
  private _id?;
  get id(): string;
  set id(id: string);
  constructor();
  logger(msg: unknown, level?: LogLevel): void;
}
