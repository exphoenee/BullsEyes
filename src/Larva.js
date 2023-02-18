import { v4 as uuid } from "uuid";

import GameObject from "./GameObject";

import { enemy, obstacle, egg, player, larva } from "./constants/names";

class Larva extends GameObject {
  constructor(game, position) {
    super(game, {
      gameObjectName: larva,
      imageSettings: {
        imageId: "larva",
        spriteWidth: 150,
        spriteHeight: 150,
        spriteOffsetX: 0.5,
        spriteOffsetY: 0.7,
      },
      collisionProperties: {
        gameObjectNames: [obstacle, enemy, player, egg],
        collisionRadius: 40,
        collisionOpacity: 0.5,
        collisionX: position.x,
        collisionY: position.y,
      },
      motionSettings: {
        speedModifier: 0.6,
        speedX: 0,
        speedY: Math.random() * 3 + 0.5,
      },
    });

    console.table({
      name: this.name,
      collsionX: this.collisionX,
      collisionY: this.collisionY,
    });

    // particle effect properties
    this.numberOfFireFlies = 15;
    this.colorOfFireFlies = "rgba(255, 0, 0, 0.5)";

    this.numberOfSparks = 15;
    this.colorOfSparks = "rgba(255, 255, 0, 0.5)";

    this.opacity = 1;
    this.opacityModifier = 0.1;
  }

  initPosition() {}

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
}

export default Larva;
