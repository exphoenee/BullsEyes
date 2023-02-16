class Egg {
  constructor(game) {
    this.game = game;
    this.collisionX = Math.random() * this.game.width;
    this.collisionY = Math.random() * this.game.height;
    this.collisionRadius = 40;
    this.collisionOpacity = 0.5;

    this.image = document.getElementById("egg");
    this.spriteWidth = 250;
    this.spriteHeight = 250;
    this.spriteOffsetX = 0.49;
    this.spriteOffsetY = 0.85;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX = this.collisionX - this.width * this.spriteOffsetX;
    this.spriteY = this.collisionY - this.height * this.spriteOffsetY;
  }
}

export default Egg;
