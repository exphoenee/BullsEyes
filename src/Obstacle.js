class Obstacle {
  constructor(game) {
    this.game = game;
    this.collisionX = Math.random() * this.game.width;
    this.collisionY = Math.random() * this.game.height;
    this.collisionRadius = 50;
    this.collisionOpacity = 0.5;

    this.draw();
  }

  draw() {
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
