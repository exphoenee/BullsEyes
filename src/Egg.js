import { v4 as uuid } from "uuid";

import Larva from "./Larva.js";

import { egg, obstacle, enemy, player } from "./constants/names.js";

class Egg {
  constructor(game) {
    this.game = game;

    this.name = egg;
    this.id = uuid();

    // collision properties
    this.collisionRadius = 40;
    this.margin = this.collisionRadius * 2;
    this.collisionOpacity = 0.5;

    // image properties
    this.image = document.getElementById("egg");
    this.spriteWidth = 110;
    this.spriteHeight = 135;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;

    // position properties
    this.collisionX;
    this.collisionY;
    this.initPosition();
    this.spriteOffsetX = 0.5;
    this.spriteOffsetY = 0.65;
    this.spriteX = this.collisionX - this.width * this.spriteOffsetX;
    this.spriteY = this.collisionY - this.height * this.spriteOffsetY;
  }

  initPosition() {
    this.collisionX =
      this.margin + Math.random() * (this.game.width - this.margin * 2);
    this.collisionY =
      this.game.topMargin +
      Math.random() *
        (this.game.height - this.collisionRadius - this.game.topMargin);
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
    this.drawHitbox();
  }

  areYou(name) {
    return this.name === name;
  }

  collision() {
    let collisionObject = [
      this.game.player,
      ...this.game.obstacles,
      ...this.game.enemies,
      ...this.game.eggs.filter((egg) => egg.id !== this.id),
    ];
    collisionObject.forEach((object) => {
      const collisionInfo = this.game.checkCollision(this, object) || {};
      const { collision } = collisionInfo;

      if (collision) {
        this.pushObject(collisionInfo);
      }
    });
  }

  hatching() {
    this.game.hatchTimer += 16 + 16 * Math.random();
    if (this.game.hatchTimer >= this.game.hatchInterval) {
      console.log("hatched");
      this.game.eggs = this.game.eggs.filter((egg) => egg.id !== this.id);
      const position = {
        x: this.collisionX,
        y: this.collisionY,
      };
      this.game.larvas.push(new Larva(this.game, position));
      console.log(this.game.larvas);
    }
  }

  objectMove() {
    this.spriteX = this.collisionX - this.width * this.spriteOffsetX;
    this.spriteY = this.collisionY - this.height * this.spriteOffsetY;
  }

  pushObject({ dx, dy, distance, sumOfRadii }) {
    this.collisionX -= (dx / distance) * (sumOfRadii - distance);
    this.collisionY -= (dy / distance) * (sumOfRadii - distance);
  }

  update() {
    this.draw();
    this.hatching();
    this.objectMove();
    this.collision();
  }
}

export default Egg;
