export default class Boot extends window.Phaser.Scene {
  constructor() {
    super("Boot");
  }

  create() {
    this.registry.set("highscore", 0);
    this.scene.start("Preloader");
  }
}
