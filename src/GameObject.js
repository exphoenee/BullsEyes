import Sparks from "./Sparks";
import Firefly from "./Firefly";

import { v4 as uuid } from "uuid";

import { pluralNames } from "./constants/names";

class GameObject {
  constructor(
    game,
    {
      gameObjectName,
      isSingleton = false,
      imageSettings = {
        imageId,
        spriteWidth,
        spriteHeight,
        spriteOffsetX,
        spriteOffsetY,
        variant,
      },
      animationSettings = {
        animationFrames: 0,
        animationDirection: 0,
        spriteDirection: 0,
        animationFrame: 0,
      },
      collisionProperties = {
        gameObjectNames: [],
        collisionRadius,
        collisionOpacity: 0.5,
        collisionX,
        collisionY,
        margin: 0,
      },
      motionSettings = { speedX: 0, speedY: 0, speedModifier: 1 },
    }
  ) {
    console.table({name: this.name, ...collisionProperties})
    if (isSingleton) {
      if (typeof GameObject.instance === "object") {
        return GameObject.instance;
      }
      GameObject.instance = this;
    }

    // set the game
    this.game = game;

    // set the name and id
    if (gameObjectName) {
      this.name = gameObjectName;
    } else {
      throw new Error("gameObjectName is required");
    }
    this.id = uuid();

    // set the image properties
    if (imageSettings) {
      this.image = document.getElementById(imageSettings.imageId);
      this.spriteWidth = imageSettings.spriteWidth;
      this.spriteHeight = imageSettings.spriteHeight;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteOffsetX = imageSettings.spriteOffsetX;
      this.spriteOffsetY = imageSettings.spriteOffsetY;

      if (imageSettings?.variant) {
        this.variant = imageSettings.variant;
        this.spriteDirection = this.variant;
      } else {
        this.variant = false;
      }
    } else {
      throw new Error("imageSettings is required");
    }

    // set the motion properties
    if (motionSettings) {
      this.speedX = motionSettings.speedX || 0;
      this.speedY = motionSettings.speedY || 0;
      this.dx;
      this.dy;
      this.speedModifier = motionSettings.speedModifier;
    }

    if (collisionProperties) {
      // set the collision properties
      this.collisionObjectNames = collisionProperties.gameObjectNames;
      this.collisionRadius = collisionProperties.collisionRadius;
      this.collisionOpacity = collisionProperties.collisionOpacity;
      this.margin = collisionProperties.margin;
      // set the position properties
      if (collisionProperties.collisionX && collisionProperties.collisionY) {
        this.collisionX = collisionProperties.collisionX;
        this.collisionY = collisionProperties.collisionY;
      } else {
        this.collisionX;
        this.collisionY;
        this.initPosition();
      }
    }

    // set the animation properties
    if (!this.variant && animationSettings) {
      this.animationFrames = animationSettings.animationFrames;
      this.animationDirection = animationSettings.animationDirection;
      this.spriteDirection = animationSettings.animationDirection;
      this.animationFrame = animationSettings.animationFrame;
    }

    // set the sprite position
    this.spriteX;
    this.spriteY;
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
      this.extraHitboxDraw && this.extraHitboxDraw();
    }
  }

  collision() {
    if (this.collisionObjectNames && this.collisionObjectNames.length > 0) {
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

  reduceOpacity() {
    this.opacity =
      this.opacity - this.opacityModifier < 0.1
        ? 0
        : this.opacity - this.opacityModifier;
  }

  kill() {
    this.reduceOpacity();
    if (this.opacity <= 0) {
      this.addSpark();
      this.init();
    }
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

  update() {
    this.draw();
    this.objectMove();
    this.updateSpritePosition();
    this.collision();
    this.objectDirection();
  }
}

export default GameObject;
