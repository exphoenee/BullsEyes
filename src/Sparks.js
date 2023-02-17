import Particle from "./Particle";

class Sparks extends Particle {
  constructor(game, position, color) {
    super(game, position, color);
  }

  objectMove() {
    this.angle += this.angleSpeed;
    this.collisionX += this.speedX * Math.cos(this.angle);
    this.collisionY -= this.speedY * Math.sin(this.angle);

    if (this.collisionY < 0) this.removeObject();
    if (this.particleTime <= 0) this.removeObject();
    this.particleTime -= 16 + Math.random() * 16;
  }
}

export default Sparks;
