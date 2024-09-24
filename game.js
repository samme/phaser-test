export default class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  preload() {
    this.load.image("grassland", "./assets/new-extruded.png");
    this.load.image("fairway", "./assets/fairway.png");
    this.load.image("fairway-green", "./assets/green.png");
    this.load.image("bunkers", "./assets/bunkers.png");

    // Load the tilemap JSON
    this.load.tilemapTiledJSON("map", "./assets/QuailHollow1.json");
  }

  create() {
    this.map = this.make.tilemap({ key: "map" });

    if (this.map) {
      // Add ground tilesets only (these can remain images)
      const grasslandTileset = this.map.addTilesetImage(
        "grassland",
        "grassland",
        128,
        128,
        1,
        2
      );
      const fairwayTileset = this.map.addTilesetImage("fairway", "fairway");
      const bunkerTileset = this.map.addTilesetImage("bunkers", "bunkers");

      if (!grasslandTileset || !fairwayTileset || !bunkerTileset) {
        console.error("Tileset not found!");
        return; // Exit if any tileset is missing
      }

      this.groundLayer = this.map.createLayer(
        "Tile Layer 1",
        [grasslandTileset, fairwayTileset, bunkerTileset],
        0,
        0
      );
      this.groundLayer?.setScrollFactor(1);
      this.groundLayer?.setCollisionByProperty({ collides: true });

      // Set camera bounds to match map size
      this.cameras.main.setBounds(
        0,
        0,
        this.map.widthInPixels,
        this.map.heightInPixels
      );

      this.tilemap = this.map;

      // Handle mouse wheel for zooming
      this.input.on("wheel", (_pointer, _gameObjects, _deltaX, deltaY) => {
        this.handleMouseWheel(deltaY);
      });
    }

    this.events.emit("sceneCreated");
  }

  handleMouseWheel(deltaY) {
    const zoomChange = deltaY * -0.001;
    const newZoom = Phaser.Math.Clamp(
      this.cameras.main.zoom + zoomChange,
      0.05,
      1
    );

    this.tweens.add({
      targets: this.cameras.main,
      zoom: newZoom,
      duration: 100,
      ease: "Sine.easeInOut",
    });
  }

  update(time, delta) {}
}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "phaser-game",
  backgroundColor: "#000000",
  pixelArt: true,

  physics: {
    default: "matter",
    matter: {
      gravity: { x: 0, y: 0 },
      debug: true,
    },
  },
  scene: [Game],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

const game = new Phaser.Game(config);

window.addEventListener("resize", () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
