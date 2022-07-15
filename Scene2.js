class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    preload() {
        this.load.image("background", "assets/images/background.png");

        this.load.spritesheet("ship", "assets/spritesheets/ship.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet("ship2", "assets/spritesheets/ship2.png", {
            frameWidth: 32,
            frameHeight: 16
        });

        this.load.spritesheet("ship3", "assets/spritesheets/ship3.png", {
            frameWidth: 32,
            frameHeight: 16
        });

        this.load.spritesheet("explosion", "assets/spritesheets/explosion.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet("power-up", "assets/spritesheets/power-up.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet("player", "assets/spritesheets/player.png", {
            frameWidth: 16,
            frameHeight: 24
        });

        this.load.spritesheet("beam", "assets/spritesheets/beam.png", {
            frameWidth: 16,
            frameHeight: 16
        });
    }

    create() {
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0, 0);

        this.ship1 = this.add.sprite(config.width / 2 - 50, config.height / 2, "ship");
        this.ship2 = this.add.sprite(config.width / 2, config.height / 2, "ship2");
        this.ship3 = this.add.sprite(config.width / 2 + 50, config.height / 2, "ship3");

        this.anims.create({
            key: "ship1_anim",
            frames: this.anims.generateFrameNumbers("ship"),
            frameRate: 20,
            repeat: -1 // infinitely loop
        });

        this.anims.create({
            key: "ship2_anim",
            frames: this.anims.generateFrameNumbers("ship2"),
            frameRate: 20,
            repeat: -1 // infinitely loop
        });

        this.anims.create({
            key: "ship3_anim",
            frames: this.anims.generateFrameNumbers("ship3"),
            frameRate: 20,
            repeat: -1 // infinitely loop
        });

        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 20,
            repeat: 0, // do not repeat
            hideOnComplete: true
        });

        this.anims.create({
            key: "red",
            frames: this.anims.generateFrameNumbers("power-up", {
                start: 0,
                end: 1
            }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "gray",
            frames: this.anims.generateFrameNumbers("power-up", {
                start: 2,
                end: 3
            }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "thrust",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "beam_anim",
            frames: this.anims.generateFrameNumbers("beam"),
            frameRate: 20,
            repeat: -1
        })

        this.powerUps = this.physics.add.group();
        this.projectiles = [];

        let maxObjects = 4;

        for(let i = 0; i <= maxObjects; i++) {
            let powerUp = this.physics.add.sprite(16, 16, "power-up");
            this.powerUps.add(powerUp);
            powerUp.setRandomPosition(0, 0, game.config.width, game.config.height);

            if(Math.random() > 0.5) {
                powerUp.play("red");
            }
            else {
                powerUp.play("gray");
            }

            powerUp.setVelocity(100, 100);
            powerUp.setCollideWorldBounds(true);
            powerUp.setBounce(1);
        }

        this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "player");
        this.player.play("thrust");
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.player.setCollideWorldBounds(true);

        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.ship1.play("ship1_anim");
        this.ship2.play("ship2_anim");
        this.ship3.play("ship3_anim");

        this.ship1.setInteractive();
        this.ship2.setInteractive();
        this.ship3.setInteractive();

        this.input.on("gameobjectdown", this.destroyShip, this); // gameobjectdown is a click event
    }

    moveShip(ship, speed) {
        ship.y += speed;

        if(ship.y > config.height) {
            ship.x = Math.random() * config.width;
            ship.y = 0;
        }
    }

    destroyShip(pointer, gameObject) {
        gameObject.setTexture("explosion");
        gameObject.play("explode");
    }

    update() {
        this.moveShip(this.ship1, 1);
        this.moveShip(this.ship2, 2);
        this.moveShip(this.ship3, 3);

        this.background.tilePositionY -= 0.5;

        this.movePlayerManager();

        if(Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            this.shootBeam();
        }

        for(let i = 0; i < this.projectiles.length; i++) {
            this.projectiles[i].update();
        }
    }

    shootBeam() {
        // let beam = this.physics.add.sprite(this.player.x, this.player.y, "beam");
        let beam = new Beam(this);
    }

    movePlayerManager() {
        if(this.cursorKeys.left.isDown) {
            this.player.setVelocityX(-gameSettings.playerSpeed);
        }
        else if(this.cursorKeys.right.isDown) {
            this.player.setVelocityX(gameSettings.playerSpeed);
        }
        else {
            this.player.setVelocityX(0);
        }

        if(this.cursorKeys.up.isDown) {
            this.player.setVelocityY(-gameSettings.playerSpeed);
        }
        else if(this.cursorKeys.down.isDown) {
            this.player.setVelocityY(gameSettings.playerSpeed);
        }
        else {
            this.player.setVelocityY(0);
        }
    }
}