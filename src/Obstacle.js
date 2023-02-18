import GameObject from "./GameObject";

import { obstacle } from "./constants/names";

class Obstacle extends GameObject {
  constructor(game) {
    super(game, {
      gameObjectName: obstacle,
      imageSettings: {
        imageId: "obstacles",
        spriteWidth: 250,
        spriteHeight: 250,
        spriteOffsetX: 0.49,
        spriteOffsetY: 0.85,
        variant: Math.floor(Math.random() * 3), //the image must linearized agains 4x3 grid
      },
      collisionProperties: {
        collisionRadius: 40,
        collisionOpacity: 0.5,
        collisionX: Math.random() * game.width,
        collisionY: Math.random() * game.height,
      },
    });
  }

  initPosition() {
    this.collisionX = Math.random() * this.game.width;
    this.collisionY = Math.random() * this.game.height;
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
