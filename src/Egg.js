import { egg, obstacle, player } from "./constants/names.js";

class Egg {
  constructor(game) {
    this.game = game;

    this.name = egg;

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
    let collisionObject = [this.game.player, ...this.game.obstacles];
    collisionObject.forEach((object) => {
      const { collision, distance, sumOfRadii, dx, dy } =
        this.game.checkCollision(this, object) || {};
      if (collision) {
        this.collisionX -= (dx / distance) * (sumOfRadii - distance);
        this.collisionY -= (dy / distance) * (sumOfRadii - distance);

        object.areYou(obstacle) && this.obstacleCollision();
        object.areYou(player) && this.playerCollision();
      }
    });
  }

  playerCollision() {
    this.game.score += 1;
  }
  obstacleCollision() {}
}

export default Egg;
