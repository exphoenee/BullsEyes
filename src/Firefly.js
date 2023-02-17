import Particle from "./Particle";

class Firefly extends Particle {
  constructor(game, position, color) {
    super(game, position, color);
  }

  objectMove() {
    this.angle += this.angleSpeed;
    this.collisionX += this.speedX;
    this.collisionY -= this.speedY;

    if (this.collisionY < 0) this.removeObject();
    if (this.particleTime <= 0) this.removeObject();
    this.particleTime -= 16 + Math.random() * 16;
  }
}

export default Firefly;
