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
}
