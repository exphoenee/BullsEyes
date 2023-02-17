import { v4 as uuid } from "uuid";
import { obstacle } from "./constants/names";

class Obstacle {
  constructor(game) {
    this.game = game;

    this.name = obstacle;
    this.id = uuid();

    // collision properties
    this.collisionRadius = 40;
    this.collisionOpacity = 0.5;

    // image properties
    this.image = document.getElementById("obstacles");
    this.spriteWidth = 250;
    this.spriteHeight = 250;
    this.spriteOffsetX = 0.49;
    this.spriteOffsetY = 0.85;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;

    // position properties
    this.collisionX;
    this.collisionY;
    this.initPosition();
    this.spriteX = this.collisionX - this.width * this.spriteOffsetX;
    this.spriteY = this.collisionY - this.height * this.spriteOffsetY;

    // animation properties
    this.frameX = Math.floor(Math.random() * 4);
    this.frameY = Math.floor(Math.random() * 3);

    this.game.debug = this.game.debug;
  }

  initPosition() {
    this.collisionX = Math.random() * this.game.width;
    this.collisionY = Math.random() * this.game.height;
  }

  drawHitbox() {
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

  areYou(name) {
    return this.name === name;
  }

  draw() {
    this.game.context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height
    );
    this.drawHitbox();
  }

  moveObject() {}

  collision() {}

  pushObject() {}

  update() {
    this.draw();
    this.moveObject();
    this.collision();
  }
}

export default Obstacle;
