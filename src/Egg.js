import { v4 as uuid } from "uuid";
import { egg, obstacle, player } from "./constants/names.js";

class Egg {
  constructor(game) {
    this.game = game;

    this.name = egg;
    this.id = uuid();

    this.collisionRadius = 40;
    this.margin = this.collisionRadius * 2;
    this.collisionX =
      this.margin + Math.random() * (this.game.width - this.margin * 2);
    this.collisionY =
      this.game.topMargin +
      Math.random() *
        (this.game.height - this.collisionRadius - this.game.topMargin);
    this.collisionOpacity = 0.5;

    this.image = document.getElementById("egg");

    this.spriteWidth = 110;
    this.spriteHeight = 135;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteOffsetX = 0.5;
    this.spriteOffsetY = 0.65;
    this.spriteX = this.collisionX - this.width * this.spriteOffsetX;
    this.spriteY = this.collisionY - this.height * this.spriteOffsetY;
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

  update() {
    let collisionObject = [
      this.game.player,
      ...this.game.obstacles,
      ...this.game.eggs.filter((egg) => egg.id !== this.id),
    ];
    collisionObject.forEach((object) => {
      const { collision, distance, sumOfRadii, dx, dy } =
        this.game.checkCollision(this, object) || {};
      if (collision) {
        object.areYou(obstacle) &&
          this.obstacleCollision(this, distance, sumOfRadii, dx, dy);
        object.areYou(player) &&
          this.playerCollision(this, distance, sumOfRadii, dx, dy);
        object.areYou(egg) &&
          this.eggCollision(this, object, distance, sumOfRadii, dx, dy);
      }
    });
  }

  moveThisEgg(object, distance, sumOfRadii, dx, dy) {
    object.collisionX -= (dx / distance) * (sumOfRadii - distance);
    object.collisionY -= (dy / distance) * (sumOfRadii - distance);

    object.spriteX = object.collisionX - object.width * object.spriteOffsetX;
    object.spriteY = object.collisionY - object.height * object.spriteOffsetY;
  }

  eggCollision(thisEgg, anotherEgg, distance, sumOfRadii, dx, dy) {
    this.moveThisEgg(thisEgg, distance, sumOfRadii, dx, dy);
    // this.moveThisEgg(anotherEgg, distance, sumOfRadii, dx, dy);
    // this makes a strange effect
  }

  playerCollision(thisEgg, distance, sumOfRadii, dx, dy) {
    this.moveThisEgg(thisEgg, distance, sumOfRadii, dx, dy);
    this.game.score += 1;
  }
  obstacleCollision(thisEgg, distance, sumOfRadii, dx, dy) {
    this.moveThisEgg(thisEgg, distance, sumOfRadii, dx, dy);
  }
}

export default Egg;
