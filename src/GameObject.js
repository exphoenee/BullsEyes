import { v4 as uuid } from "uuid";

import { pluralNames } from "./constants/names";

class GameObject {
  constructor(
    game,
    {
      name,
      isSingleton = false,
      imageSettings = {
        imageId,
        spriteWidth,
        spriteHeight,
        spriteOffsetX,
        spriteOffsetY,
      },
      animationSettings = {
        animationFrames,
        animationDirection,
        spriteDirection,
        animationFrame,
      },
      collisionProperties = {
        gameObjectNames,
        collisionRadius,
        collisionOpacity,
        collisionX,
        collisionY,
      },
      motionSettings = {
        speedModifier,
      },
    }
  ) {
    if (isSingleton) {
      if (typeof GameObject.instance === "object") {
        return GameObject.instance;
      }
      GameObject.instance = this;
    }

    // set the game
    this.game = game;

    // set the name and id
    this.name = name;
    this.id = uuid();

    // set the image properties
    this.image = document.getElementById(imageSettings.imageId);
    this.spriteWidth = imageSettings.spriteWidth;
    this.spriteHeight = imageSettings.spriteHeight;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteOffsetX = imageSettings.spriteOffsetX;
    this.spriteOffsetY = imageSettings.spriteOffsetY;

    // set the motion properties
    this.speedX = 0;
    this.speedY = 0;
    this.dx = 0;
    this.dy = 0;
    this.speedModifier = motionSettings.speedModifier;

    // set the position properties
    if (collisionProperties.collisionX && collisionProperties.collisionY) {
      this.collisionX = this.collisionProperties.collisionX;
      this.collisionY = this.collisionProperties.collisionY;
    } else {
      this.collisionX;
      this.collisionY;
      this.initPosition();
    }

    // set the collision properties
    this.collisionObjectNames = collisionProperties.gameObjectNames || [];
    this.collisionRadius = collisionProperties.collisionRadius;
    this.collisionOpacity = motionSettings.collisionOpacity || 0.5;

    // set the animation properties
    this.animationFrames = animationSettings.animationFrames || 0;
    this.animationDirection = animationSettings.animationDirection || 0;
    this.spriteDirection = animationSettings.animationDirection || 0;
    this.animationFrame = animationSettings.animationFrame || 0;

    // set the sprite position
    this.updateSpritePosition();
  }

  initPosition() {
    console.warn("initPosition() not implemented");
  }

  areYou(name) {
    return this.name === name;
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
    this.drawHitbox();
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
      this.game.context.beginPath();
      this.game.context.moveTo(this.collisionX, this.collisionY);
      this.game.context.lineTo(this.game.mouse.x, this.game.mouse.y);
      this.game.context.stroke();
    }
  }
  collision() {
    if (this.collisionObjectNames.length === 0) {
      this.collisionObjectNames
        .map((gameObjectName) => {
          const pluralObjectName =
            pluralNames[gameObjectName] || gameObjectName;
          return this.game[pluralObjectName];
        })
        .flat()
        .forEach((object) => {
          const collisionInfo = this.game.checkCollision(this, object) || {};
          const { collision } = collisionInfo;

          if (collision) {
            this.pushObject(collisionInfo);
          }
        });
    }
  }

  pushObject({ distance, sumOfRadii, dx, dy }) {
    this.collisionX -= (dx / distance) * (sumOfRadii - distance);
    this.collisionY -= (dy / distance) * (sumOfRadii - distance);
  }

  objectDirection() {
    if (this.animationDirection >= 0) {
      const angleStep = 360 / this.animationDirection;

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
  }

  objectMove() {
    console.warn("objectMove() not implemented");
  }

  updateSpritePosition() {
    this.spriteX = this.collisionX - this.width * this.spriteOffsetX;
    this.spriteY = this.collisionY - this.height * this.spriteOffsetY;
  }

  update() {
    this.draw();
    this.objectMove();
    this.updateSpritePosition();
    this.collision();
    this.objectDirection();
  }
}

export default GameObject;