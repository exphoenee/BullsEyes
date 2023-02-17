import { v4 as uuid } from "uuid";
import { enemy, obstacle, egg, player } from "./constants/names";

class Enemy {
  constructor(game) {
    this.game = game;

    this.name = enemy;
    this.id = uuid();

    // image properties
    this.image = document.getElementById("toad");
    this.spriteWidth = 140;
    this.spriteHeight = 260;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteOffsetX = 0.5;
    this.spriteOffsetY = 0.85;

    //  position properties
    this.collisionX;
    this.collisionY;
    this.initPosition();
    this.collisionRadius = 30;
    this.collisionOpacity = 0.5;
    this.spriteX = this.collisionX - this.width * this.spriteOffsetX;
    this.spriteY = this.collisionY - this.height * this.spriteOffsetY;

    // motion properties
    this.sppedX = Math.random() * 3 + 0.5;
    this.speedY = 0;
    this.dx = 0;
    this.dy = 0;
    this.speedModifier = 1;

    // animation properties
    this.spriteDirection = 0;
    this.animationFrame = 0;
  }

  areYou(name) {
    return this.name === name;
  }

  initPosition() {
    this.collisionX = this.game.width + this.width;
    this.collisionY =
      this.game.topMargin +
      Math.random() * (this.game.height - this.game.topMargin + this.height);
  }

  draw() {
    this.game.context.drawImage(
      this.image,
      this.animationFrame * this.spriteWidth,
      this.spriteDirection * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height
    );
    this.drwaHitbox();
  }

  drwaHitbox() {
    if (this.game.debug) {
      this.game.context.beginPath();
      this.game.context.arc(
        this.collisionX,
        this.collisionY,
        this.collisionRadius,
        0,
        Math.PI * 2,
        false
      );
      this.game.context.save();
      this.game.context.globalAlpha = this.collisionOpacity;
      this.game.context.fill();
      this.game.context.restore();
      this.game.context.stroke();
    }
  }

  collision() {
    [...this.game.obstacles].forEach((object) => {
      const collisionInfo = this.game.checkCollision(this, object) || {};
      const { collision } = collisionInfo;

      if (collision) {
        object.areYou(obstacle) && this.pushObject(collisionInfo);
      }
    });
  }

  pushObject({ dx, dy, distance, sumOfRadii }) {
    this.collisionX -= (dx / distance) * (sumOfRadii - distance);
    this.collisionY -= (dy / distance) * (sumOfRadii - distance);
  }

  objectDirection() {
    const angleStep = 360 / 8;

    const angle = Math.floor(
      ((Math.atan2(
        this.game.mouse.y - this.collisionY,
        this.game.mouse.x - this.collisionX
      ) *
        360) /
        (2 * Math.PI) +
        90 +
        360) %
        360
    );

    this.spriteDirection = Math.floor(angle / angleStep);
  }

  objectMove() {
    this.collisionX -= this.sppedX * this.speedModifier;
    this.collisionY -= this.speedY * this.speedModifier;

    if (this.spriteX + this.width < 0) this.initPosition();

    if (this.collisionX > this.game.width - this.collisionRadius)
      this.collisionX = this.game.width - this.collisionRadius;
    if (this.collisionY < this.game.topMargin + this.collisionRadius)
      this.collisionY = this.game.topMargin + this.collisionRadius;
    if (this.collisionY > this.game.height - this.collisionRadius)
      this.collisionY = this.game.height - this.collisionRadius;

    // this.animationFrame = this.animationFrame < 58 ? this.animationFrame + 1 : 0;

    this.spriteX = this.collisionX - this.width * this.spriteOffsetX;
    this.spriteY = this.collisionY - this.height * this.spriteOffsetY;
  }

  update() {
    this.objectMove();
    this.collision();
  }
}

export default Enemy;
