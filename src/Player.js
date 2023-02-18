import { v4 as uuid } from "uuid";

import GameObject from "./GameObject";

import { player } from "./constants/names";

class Player extends GameObject {
  constructor(game) {
    super(game, {
      name: player,
      isSingleton: true,
      imageSettings: {
        imageId: "bull",
        spriteWidth: 255,
        spriteHeight: 256,
        spriteOffsetX: 0.5,
        spriteOffsetY: 0.65,
      },
      animationSettings: {
        animationFrames: 58,
        animationDirection: 8,
      },
      collisionProperties: {
        collisionRadius: 50,
        collisionOpacity: 0.5,
      },
      motionSettings: {
        speedModifier: 5,
      },
    });
  }

  initPosition() {
    this.collisionX = this.game.width * 0.5;
    this.collisionY = this.game.height * 0.5;
  }

  objectMove() {
    this.dx = this.game.mouse.x - this.collisionX;
    this.dy = this.game.mouse.y - this.collisionY;
    const distance = Math.hypot(this.dy, this.dx);

    if (distance <= this.speedModifier) {
      this.speedX = 0;
      this.speedY = 0;
    } else {
      this.speedX = this.dx / distance || 0;
      this.speedY = this.dy / distance || 0;
    }

    this.collisionX += this.speedX * this.speedModifier;
    this.collisionY += this.speedY * this.speedModifier;

    if (this.collisionX < this.collisionRadius)
      this.collisionX = this.collisionRadius;
    if (this.collisionX > this.game.width - this.collisionRadius)
      this.collisionX = this.game.width - this.collisionRadius;
    if (this.collisionY < this.game.topMargin + this.collisionRadius)
      this.collisionY = this.game.topMargin + this.collisionRadius;
    if (this.collisionY > this.game.height - this.collisionRadius)
      this.collisionY = this.game.height - this.collisionRadius;

    this.animationFrame =
      this.animationFrame < this.animationFrames ? this.animationFrame + 1 : 0;
  }
}

export default Player;
