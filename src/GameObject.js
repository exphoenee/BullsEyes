import { v4 as uuid } from "uuid";

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
      },
      collisionProperties = {
        collisionRadius,
      },
      positionProperties = {
        collisionX,
        collisionY,
      },
      motionSettings = {
        speedModifier,
        collisionOpacity,
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

    // set the motion properties
    this.speedX = 0;
    this.speedY = 0;
    this.dx = 0;
    this.dy = 0;
    this.speedModifier = motionSettings.speedModifier;

    // set the position properties
    this.collisionX = positionProperties.collisionX;
    this.collisionY = positionProperties.collisionY;

    // set the collision properties
    this.collisionRadius = collisionProperties.collisionRadius;
    this.collisionOpacity = motionSettings.collisionOpacity;
    this.spriteOffsetX = imageSettings.spriteOffsetX;
    this.spriteOffsetY = imageSettings.spriteOffsetY;

    // set the animation properties
    this.animationFrames = animationSettings.animationFrames;
    this.animationDirection = animationSettings.animationDirection;
    this.spriteDirection = 0;
    this.animationFrame = 0;

    // set the sprite position
    this.spriteX = this.collisionX - this.width * this.spriteOffsetX;
    this.spriteY = this.collisionY - this.height * this.spriteOffsetY;
  }

  initPosition() {
    this.collisionX = this.game.width * 0.5;
    this.collisionY = this.game.height * 0.5;
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
    this.drwaHitbox();
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
    console.warn("collision() not implemented");
  }

  pushObject({ distance, sumOfRadii, dx, dy }) {
    this.collisionX -= (dx / distance) * (sumOfRadii - distance);
    this.collisionY -= (dy / distance) * (sumOfRadii - distance);
  }

  objectDirection() {
    const angleStep = 360 / this.ainmationDirection;

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

  objectMove() {
    console.warn("objectMove() not implemented");
  }

  update() {
    this.draw();
    this.objectMove();
    this.collision();
    this.objectDirection();
  }
}

export default GameObject;