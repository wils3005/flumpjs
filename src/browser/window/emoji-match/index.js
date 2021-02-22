import Boot from "./Boot.js";
import MainGame from "./Game.js";
import MainMenu from "./MainMenu.js";
import Preloader from "./Preloader.js";

const config = {
  type: window.Phaser.AUTO,
  width: 600,
  height: 600,
  backgroundColor: "#008eb0",
  parent: "phaser",
  scene: [Boot, Preloader, MainMenu, MainGame],
};

const game = new window.Phaser.Game(config);

export { game };
