import Player from "./Player.js";
import Obstacle from "./Obstacle.js";

class Game {
  constructor() {
    if (typeof Game.instance === "object") {
      return Game.instance;
    }
    Game.instance = this;

    this.width = 1280;
    this.height = 720;

    this.canvas = document.getElementById("canvas1");
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.context = this.canvas.getContext("2d");
    this.context.fillStyle = "white";
    this.context.strokeStyle = "white";
    this.context.lineWidth = 3;

    this.player = new Player(this);
    this.numberOfObstacles = 10;
    this.obstacles = [];

    this.mouse = {
      x: this.width * 0.5,
      y: this.height * 0.5,
      pressed: false,
    };

    this.canvas.addEventListener("mousedown", (e) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
      this.mouse.pressed = true;
    });

    this.canvas.addEventListener("mouseup", (e) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
      this.mouse.pressed = false;
    });
    this.canvas.addEventListener("mousemove", (e) => {
      if (this.mouse.pressed) {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
      }
    });
  }

  render() {
    this.context.clearRect(0, 0, this.width, this.height);
    this.player.draw();
    this.player.update();
    this.obstacles.forEach((obstacle) => obstacle.draw());
  }

  init() {
    let attempts = 0;
    while (this.obstacles.length < this.numberOfObstacles && attempts < 1000) {
      let testObstacle = new Obstacle(this);
      attempts++;

      let collision = false;

      [...this.obstacles, this.player].forEach((obstacle) => {
        const dx = testObstacle.collisionX - obstacle.collisionX;
        const dy = testObstacle.collisionY - obstacle.collisionY;
        const distance = Math.hypot(dx, dy);
        const sumOfRadii =
          testObstacle.collisionRadius + obstacle.collisionRadius;
        if (distance < sumOfRadii) collision = true;
      });

      !collision && this.obstacles.push(testObstacle);
    }
  }
}

export default Game;
