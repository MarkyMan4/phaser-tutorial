class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    preload() {
        this.load.image("background", "assets/images/background.png");
        this.load.image("ship", "assets/images/ship.png");
        this.load.image("ship2", "assets/images/ship2.png");
        this.load.image("ship3", "assets/images/ship3.png");
    }

    create() {
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0, 0);

        this.ship1 = this.add.image(config.width / 2 - 50, config.height / 2, "ship");
        this.ship2 = this.add.image(config.width / 2, config.height / 2, "ship2");
        this.ship3 = this.add.image(config.width / 2 + 50, config.height / 2, "ship3");

        this.add.text(20, 20, "Playing game", {font: "25px Arial", fill: "yellow"});
    }

    moveShip(ship, speed) {
        ship.y += speed;

        if(ship.y > config.height) {
            ship.x = Math.random() * config.width;
            ship.y = 0;
        }
    }

    update() {
        this.moveShip(this.ship1, 1);
        this.moveShip(this.ship2, 2);
        this.moveShip(this.ship3, 3);

        this.background.tilePositionY -= 0.5;
    }
}