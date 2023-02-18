import { v4 as uuid } from "uuid";

import Particle from "./Particle";
import Firefly from "./Firefly";
import Sparks from "./Sparks";

import { enemy, obstacle, egg, player, larva } from "./constants/names";

class Larva {
  constructor(game, position) {
    this.game = game;

    this.name = larva;
    this.id = uuid();

    // image properties
    this.image = document.getElementById("larva");
    this.spriteWidth = 150;
    this.spriteHeight = 150;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteOffsetX = 0.5;
    this.spriteOffsetY = 0.7;

    //  position properties
    this.collisionX = position.x;
    this.collisionY = position.y;
    this.initPosition();
    this.collisionRadius = 40;
    this.collisionOpacity = 0.5;
    this.spriteX = this.collisionX - this.width * this.spriteOffsetX;
    this.spriteY = this.collisionY - this.height * this.spriteOffsetY;

    // motion properties
    this.speedX = 0;
    this.speedY = Math.random() * 3 + 0.5;
    this.dx = 0;
    this.dy = 0;
    this.speedModifier = 0.6;

    // animation properties
    this.animationFrames = 0;
    this.spriteDirection = 0;
    this.animationFrame = 0;

    // particle effect properties
    this.numberOfFireFlies = 15;
    this.colorOfFireFlies = "rgba(255, 0, 0, 0.5)";

    this.numberOfSparks = 15;
    this.colorOfSparks = "rgba(255, 255, 0, 0.5)";

    this.opacity = 1;
    this.opacityModifier = 0.1;
  }

  areYou(name) {
    return this.name === name;
  }

  initPosition() {}

  draw() {
    this.game.context.save();
    this.game.context.globalAlpha = this.opacity;
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
    this.game.context.restore();
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
    [
      this.game.player,
      ...this.game.obstacles,
      ...this.game.enemies,
      ...this.game.eggs,
    ].forEach((object) => {
      const collisionInfo = this.game.checkCollision(this, object) || {};
      const { collision } = collisionInfo;

      if (collision) {
        this.pushObject(collisionInfo);
        if (object.areYou(enemy)) this.eaten();
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

  addSpark() {
    const position = {
      x: this.collisionX,
      y: this.collisionY,
    };
    for (let i = 0; i < this.numberOfSparks; i++) {
      this.game.particles.push(
        new Sparks(this.game, position, this.colorOfSparks)
      );
    }
  }

  addFireFlies() {
    const position = {
      x: this.collisionX,
      y: this.collisionY,
    };
    for (let i = 0; i < this.numberOfFireFlies; i++) {
      this.game.particles.push(
        new Firefly(this.game, position, this.colorOfFireFlies)
      );
    }
  }

  removeObject() {
    this.game.larvas = this.game.larvas.filter((larva) => larva.id !== this.id);
  }

  reduceOpacity() {
    this.opacity =
      this.opacity - this.opacityModifier < 0.1
        ? 0
        : this.opacity - this.opacityModifier;
  }

  eaten() {
    this.reduceOpacity();
    if (this.opacity <= 0) {
      this.game.score -= 1;
      this.removeObject();
      this.addSpark();
    }
  }

  survived() {
    this.reduceOpacity();
    if (this.opacity <= 0) {
      this.game.score += 1;
      this.removeObject();
      this.addFireFlies();
    }
  }

  objectMove() {
    this.collisionX -= this.speedX * this.speedModifier;
    this.collisionY -= this.speedY * this.speedModifier;

    if (this.collisionX > this.game.width - this.collisionRadius)
      this.collisionX = this.game.width - this.collisionRadius;
    if (this.collisionY < this.game.topMargin - this.height) this.survived();
    if (this.collisionY > this.game.height - this.collisionRadius)
      this.collisionY = this.game.height - this.collisionRadius;

    this.animationFrame =
      this.animationFrame < this.animationFrames ? this.animationFrame + 1 : 0;

    this.spriteX = this.collisionX - this.width * this.spriteOffsetX;
    this.spriteY = this.collisionY - this.height * this.spriteOffsetY;
  }

  update() {
    this.draw();
    this.objectMove();
    this.collision();
  }
}

export default Larva;
