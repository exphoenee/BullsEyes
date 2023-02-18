import GameObject from "./GameObject";

import { enemy, player, obstacle, egg } from "./constants/names";

class Enemy extends GameObject {
  constructor(game) {
    super(game, {
      gameObjectName: enemy,
      imageSettings: {
        imageId: "toad",
        spriteWidth: 140,
        spriteHeight: 260,
        spriteOffsetX: 0.4,
        spriteOffsetY: 0.5,
        variant: Math.floor(Math.random() * 4),
      },
      collisionProperties: {
        gameObjectNames: [obstacle, player],
        collisionRadius: 50,
      },
      motionSettings: {
        speedModifier: 1,
        speedX: Math.random() * 3 + 0.5,
      },
    });

    // life time properties
    this.lifeTime = 0;
    this.lifeTimeLimit = 20000;

    this.numberOfSparks = 15;
    this.colorOfSparks = "rgba(0, 255, 0, 0.5)";
    this.opacity = 1;
    this.opacityModifier = 0.1;
  }

  initPosition() {
    this.collisionX = this.game.width + this.width;
    this.collisionY =
      this.game.topMargin + Math.random() * (this.game.height - this.height);
  }

  init() {
    this.initPosition();
    this.opacity = 1;
    this.lifeTime = 0;
  }

  objectMove() {
    this.collisionX -= this.speedX * this.speedModifier;
    this.collisionY -= this.speedY * this.speedModifier;
    if (this.spriteX + this.width < 0) this.init();

    if (this.collisionX > this.game.width - this.collisionRadius)
      this.collisionX = this.game.width - this.collisionRadius;
    if (this.collisionY < this.game.topMargin + this.collisionRadius)
      this.collisionY = this.game.topMargin + this.collisionRadius;
    if (this.collisionY > this.game.height - this.collisionRadius)
      this.collisionY = this.game.height - this.collisionRadius;

    this.animationFrame =
      this.animationFrame < this.animationFrames ? this.animationFrame + 1 : 0;

    this.spriteX = this.collisionX - this.width * this.spriteOffsetX;
    this.spriteY = this.collisionY - this.height * this.spriteOffsetY;

    this.lifeTime += 16;
    if (this.lifeTime > this.lifeTimeLimit) this.kill();
  }

  update() {
    this.draw();
    this.objectMove();
    this.collision();
  }
}

export default Enemy;
