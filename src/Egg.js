import Larva from "./Larva.js";
import GameObject from "./GameObject.js";

import { egg, obstacle, enemy, player } from "./constants/names.js";

class Egg extends GameObject {
  constructor(game) {
    super(game, {
      gameObjectName: egg,
      isSingleton: false,
      imageSettings: {
        imageId: "egg",
        spriteWidth: 110,
        spriteHeight: 135,
        spriteOffsetX: 0.5,
        spriteOffsetY: 0.65,
      },
      collisionProperties: {
        gameObjectNames: [obstacle, enemy, player],
        collisionRadius: 40,
        collisionOpacity: 0.5,
        margin: 80,
      },
    });

    // this.spriteX = this.collisionX - this.width * this.spriteOffsetX;
    // this.spriteY = this.collisionY - this.height * this.spriteOffsetY;
    // hatching properties
    this.hatchTimer = 0;
  }

  initPosition() {
    this.collisionX =
      this.margin + Math.random() * (this.game.width - this.margin * 2);
    this.collisionY =
      this.game.topMargin +
      Math.random() *
        (this.game.height - this.collisionRadius - this.game.topMargin);
  }

  draw() {
    this.game.context.drawImage(
      this.image,
      0,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height
    );
    const displayHatchTimer =
      Math.floor((this.game.hatchInterval - this.hatchTimer) / 1000) + 1;
    this.game.context.save();
    this.game.context.globalAlpha = 0.5;
    this.game.context.fillText(
      displayHatchTimer,
      this.spriteX + this.width * 0.4,
      this.spriteY - this.height * 0.1
    );
    this.game.context.restore();
    this.drawHitbox();
  }

  hatching() {
    this.hatchTimer += 16 + 16 * Math.random();
    if (this.hatchTimer >= this.game.hatchInterval) {
      this.game.eggs = this.game.eggs.filter((egg) => egg.id !== this.id);
      const position = {
        x: this.collisionX,
        y: this.collisionY,
      };
      this.game.larvas.push(new Larva(this.game, position));
    }
  }

  objectMove() {
    this.spriteX = this.collisionX - this.width * this.spriteOffsetX;
    this.spriteY = this.collisionY - this.height * this.spriteOffsetY;
  }

  update() {
    this.draw();
    this.hatching();
    this.objectMove();
    this.collision();
  }
}

export default Egg;
