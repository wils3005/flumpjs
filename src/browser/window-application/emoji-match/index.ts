import Phaser from "phaser";
import Config from "../../config";
import MyScene from "./scenes/my-scene";

class EmojiMatch {
  config: Config;

  logger: typeof Config.prototype.logger;

  gameConfig = {
    type: Phaser.AUTO,
    width: 600,
    height: 600,
    backgroundColor: "#008eb0",
    parent: "phaser",
    scene: [MyScene],
  };

  game = new Phaser.Game(this.gameConfig);

  constructor(config: Config) {
    this.config = config;
    this.logger = config.logger.bind(this);
    this.logger("constructor");
  }
}

export default EmojiMatch;
