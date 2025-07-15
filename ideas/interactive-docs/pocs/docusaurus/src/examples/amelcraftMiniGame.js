// Complete Amelcraft mini-game
class AmelcraftMiniGame extends Phaser.Scene {
  constructor() {
    super({ key: "AmelcraftMiniGame" });
  }

  preload() {
    // Create textures
    const graphics = this.add.graphics();

    // Create grass texture
    graphics.fillStyle(0x27ae60);
    graphics.fillRect(0, 0, 48, 48);
    graphics.fillStyle(0x2ecc71);
    graphics.fillRect(4, 4, 40, 40);
    graphics.generateTexture("grass", 48, 48);

    // Create stone texture
    graphics.clear();
    graphics.fillStyle(0x7f8c8d);
    graphics.fillRect(0, 0, 48, 48);
    graphics.fillStyle(0x95a5a6);
    graphics.fillRect(4, 4, 40, 40);
    graphics.generateTexture("stone", 48, 48);

    // Create player texture
    graphics.clear();
    graphics.fillStyle(0x3498db);
    graphics.fillCircle(24, 24, 18);
    graphics.fillStyle(0x2980b9);
    graphics.fillCircle(24, 24, 12);
    graphics.generateTexture("player", 48, 48);

    graphics.destroy();
  }

  create() {
    this.tileSize = 48;
    this.worldTiles = [];

    // Initialize world grid
    for (let x = 0; x < 20; x++) {
      this.worldTiles[x] = [];
      for (let y = 0; y < 15; y++) {
        this.worldTiles[x][y] = 0;
      }
    }

    // Create background grid
    this.drawGrid();

    // Create player
    this.player = this.add.sprite(400, 300, "player");
    this.player.setScale(0.8);

    // Initialize game state
    this.isDragging = false;
    this.targetPos = { x: 400, y: 300 };
    this.selectedBlock = "grass";
    this.inventory = { grass: 10, stone: 5 };

    // Set up input events
    this.setupInput();

    // Create UI
    this.createUI();

    // Calculate and apply optimal zoom
    this.updateCameraZoom();
  }

  setupInput() {
    // Drag to move
    this.input.on("pointerdown", (pointer) => {
      this.isDragging = true;
      this.targetPos = { x: pointer.worldX, y: pointer.worldY };
    });

    this.input.on("pointermove", (pointer) => {
      if (this.isDragging) {
        this.targetPos = { x: pointer.worldX, y: pointer.worldY };
      }
    });

    this.input.on("pointerup", (pointer) => {
      this.isDragging = false;

      // Check if we're placing a block
      if (pointer.duration < 200) {
        // Quick click/tap
        this.placeBlock(pointer);
      }
    });

    // Keyboard controls for block selection
    this.input.keyboard.on("keydown-ONE", () => {
      this.selectedBlock = "grass";
      this.updateUI();
    });

    this.input.keyboard.on("keydown-TWO", () => {
      this.selectedBlock = "stone";
      this.updateUI();
    });
  }

  placeBlock(pointer) {
    const tileX = Math.floor(pointer.worldX / this.tileSize);
    const tileY = Math.floor(pointer.worldY / this.tileSize);

    if (tileX >= 0 && tileX < 20 && tileY >= 0 && tileY < 15) {
      if (
        this.worldTiles[tileX][tileY] === 0 &&
        this.inventory[this.selectedBlock] > 0
      ) {
        this.worldTiles[tileX][tileY] = this.selectedBlock;
        this.inventory[this.selectedBlock]--;

        this.add.sprite(
          tileX * this.tileSize + this.tileSize / 2,
          tileY * this.tileSize + this.tileSize / 2,
          this.selectedBlock
        );

        this.updateUI();
      }
    }
  }

  createUI() {
    // Create UI background
    this.uiBackground = this.add.graphics();
    this.uiBackground.fillStyle(0x000000, 0.7);
    this.uiBackground.fillRect(10, 10, 300, 100);
    this.uiBackground.setScrollFactor(0);

    // Create UI text
    this.uiText = this.add.text(20, 20, "", {
      fontSize: "16px",
      fill: "#fff",
    });
    this.uiText.setScrollFactor(0);

    this.updateUI();
  }

  updateUI() {
    const uiContent = [
      "Drag to move, Quick click to place blocks",
      "Press 1 for Grass, 2 for Stone",
      `Selected: ${this.selectedBlock}`,
      `Inventory: Grass: ${this.inventory.grass}, Stone: ${this.inventory.stone}`,
    ];

    this.uiText.setText(uiContent.join("\n"));
  }

  drawGrid() {
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0xcccccc, 0.3);

    for (let x = 0; x <= 20; x++) {
      graphics.moveTo(x * this.tileSize, 0);
      graphics.lineTo(x * this.tileSize, 15 * this.tileSize);
    }

    for (let y = 0; y <= 15; y++) {
      graphics.moveTo(0, y * this.tileSize);
      graphics.lineTo(20 * this.tileSize, y * this.tileSize);
    }

    graphics.strokePath();
  }

  updateCameraZoom() {
    const gameWidth = this.sys.game.config.width;
    const gameHeight = this.sys.game.config.height;

    // Define minimum tiles we want to see on screen
    const minTilesX = 8; // Minimum 8 tiles horizontally
    const minTilesY = 6; // Minimum 6 tiles vertically

    // Calculate zoom needed to fit minimum tiles
    const zoomForMinTilesX = gameWidth / (this.tileSize * minTilesX);
    const zoomForMinTilesY = gameHeight / (this.tileSize * minTilesY);

    // Use the smaller zoom to ensure both minimums are met
    const minZoom = Math.min(zoomForMinTilesX, zoomForMinTilesY);

    // Cap the zoom at 1.0 for larger screens (desktop/tablet)
    // Only reduce zoom if we can't fit minimum tiles at 1.0x
    const optimalZoom = Math.min(1.0, minZoom);

    this.cameras.main.setZoom(optimalZoom);
  }

  update() {
    // Smoothly move player towards target position
    if (this.isDragging) {
      const speed = 0.15;
      this.player.x += (this.targetPos.x - this.player.x) * speed;
      this.player.y += (this.targetPos.y - this.player.y) * speed;
    }

    // Keep camera centered on player
    this.cameras.main.centerOn(this.player.x, this.player.y);
  }
}

// Initialize the game with responsive dimensions
const config = {
  type: Phaser.AUTO,
  width: window.GAME_WIDTH || 800,
  height: window.GAME_HEIGHT || 600,
  parent: "game-container",
  scene: AmelcraftMiniGame,
  backgroundColor: "#f39c12",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

window.game = new Phaser.Game(config);
