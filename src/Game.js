import Player from "./Player.js";
import Obstacle from "./Obstacle.js";
import Egg from "./Egg.js";

class Game {
  constructor() {
    if (typeof Game.instance === "object") {
      return Game.instance;
    }
    Game.instance = this;
    this.debug = true;

    this.fps = 60;
    this.lastRender = 0;

    this.width = 1280;
    this.height = 720;
    this.topMargin = 260;

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
    this.minimumObstacleDistance = 70;

    this.score = 0;

    this.numberOfEggs = 10;
    this.eggs = [];
    this.minimumEggDistance = 70;
    this.eggTimer = 0;
    this.eggInterval = 750;

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
    window.addEventListener("keydown", (e) => {
      if (e.key == "d") this.debug = !this.debug;
    });
  }

  render() {
    this.context.clearRect(0, 0, this.width, this.height);
    this.obstacles.forEach((obstacle) => obstacle.draw());
    this.eggs.forEach((egg) => egg.draw());
    this.eggs.forEach((egg) => egg.update());
    this.player.draw();
    this.player.update();
  }

  checkCollision(a, b, distanceBuffer = 0) {
    const dx = b.collisionX - a.collisionX;
    const dy = b.collisionY - a.collisionY;
    const distance = Math.hypot(dy, dx);
    const sumOfRadii = a.collisionRadius + b.collisionRadius + distanceBuffer;
    if (distance < sumOfRadii) {
      return {
        collision: distance < sumOfRadii,
        distance,
        sumOfRadii,
        dx,
        dy,
        names: [a.name, b.name],
      };
    }
  }

  generateObstacles() {
    let attempts = 0;
    while (this.obstacles.length < this.numberOfObstacles && attempts < 500) {
      let testObstacle = new Obstacle(this);

      let collision = false;

      [...this.obstacles, this.player].forEach((obstacle) => {
        const a = testObstacle;
        const b = obstacle;
        const distanceBuffer = 150;

        if (this.checkCollision(a, b, distanceBuffer)) {
          collision = true;
        }
      });

      const margin =
        testObstacle.collisionRadius + this.minimumObstacleDistance;

      !collision &&
        testObstacle.spriteX > 0 &&
        testObstacle.spriteX < this.width - testObstacle.width &&
        testObstacle.collisionY > this.topMargin + margin &&
        testObstacle.collisionY < this.height - margin &&
        this.obstacles.push(testObstacle);

      attempts++;
    }
  }

  addEgg() {
    this.eggs.push(new Egg(this));
  }

  animate(timeStamp) {
    if (timeStamp - this.lastRender > 1000 / 60) {
      this.render();
      this.lastRender = timeStamp;

      if (
        this.eggTimer > this.eggInterval &&
        this.eggs.length < this.numberOfEggs
      ) {
        this.addEgg();
        this.eggTimer = 0;
      } else {
        this.eggTimer += Math.random() * 16;
      }
    }
    window.requestAnimationFrame(this.animate.bind(this));
  }

  init() {
    this.generateObstacles();
    this.animate(this.lastRender);
  }
}

export default Game;
