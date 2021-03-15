import BrowserApplication from "../..";
import MyScene from "./scenes/my-scene";
import Phaser from "phaser";

class EmojiMatch {
  gameConfig = {
    type: Phaser.AUTO,
    width: 600,
    height: 600,
    backgroundColor: "#008eb0",
    parent: "phaser",
    scene: [MyScene],
  };

  game = new Phaser.Game(this.gameConfig);

  app: BrowserApplication;

  constructor(app: BrowserApplication) {
    this.app = app;
    this.app.logger("EmojiMatch.constructor");
  }
}

export default EmojiMatch;
