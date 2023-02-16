class Obstacle {
  constructor(game) {
    this.game = game;
    this.collisionX = Math.random() * this.game.width;
    this.collisionY = Math.random() * this.game.height;
    this.collisionRadius = 50;
    this.collisionOpacity = 0.5;

    this.image = document.getElementById("obstacles");
    this.spriteWidth = 250;
    this.spriteHeight = 250;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX = this.collisionX - this.width * 0.49;
    this.spriteY = this.collisionY - this.height * 0.85;

    this.frameX = Math.floor(Math.random()*4);
    this.frameY = Math.floor(Math.random()*3);
  }

  draw() {
    this.game.context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height
    );
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

export default Obstacle;
