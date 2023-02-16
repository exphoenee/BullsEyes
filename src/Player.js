class Player {
  constructor(game) {
    if (typeof Player.instance === "object") {
      return Player.instance;
    }
    Player.instance = this;
    this.game = game;
    this.collisionX = this.game.width * 0.5;
    this.collisionY = this.game.height * 0.5;
    this.collisionRadius = 50;
    this.collisionOpacity = 0.5;

    this.sppedX = 0;
    this.speedY = 0;
    this.dx = 0;
    this.dy = 0;
    this.speedModifier = 5;
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
    this.game.context.beginPath();
    this.game.context.moveTo(this.collisionX, this.collisionY);
    this.game.context.lineTo(this.game.mouse.x, this.game.mouse.y);
    this.game.context.stroke();
  }

  obstacleCollision() {
    this.game.obstacles.forEach((obstacle) => {
      const { collision, distance, sumOfRadii, dx, dy } =
        this.game.checkCollision(this, obstacle) || {};

      if (collision) {
        this.collisionX -= (dx / distance) * (sumOfRadii - distance);
        this.collisionY -= (dy / distance) * (sumOfRadii - distance);
      }
    });
  }

  movePlayer() {
    this.dx = this.game.mouse.x - this.collisionX;
    this.dy = this.game.mouse.y - this.collisionY;
    const distance = Math.hypot(this.dy, this.dx);

    if (distance <= this.speedModifier) {
      this.sppedX = 0;
      this.speedY = 0;
    } else {
      this.sppedX = this.dx / distance || 0;
      this.speedY = this.dy / distance || 0;
    }

    this.collisionX += this.sppedX * this.speedModifier;
    this.collisionY += this.speedY * this.speedModifier;
  }

  update() {
    this.movePlayer();
    this.obstacleCollision();
  }
}

export default Player;
