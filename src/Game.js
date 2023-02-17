import Player from "./Player.js";
import Obstacle from "./Obstacle.js";
import Egg from "./Egg.js";
import Enemy from "./Enemy.js";

class Game {
  constructor() {
    if (typeof Game.instance === "object") {
      return Game.instance;
    }
    Game.instance = this;

    // application mode
    this.debug = false;

    // rendering properties
    this.fps = 60;
    this.lastRender = 0;

    // game area properties
    this.width = 1280;
    this.height = 720;
    this.topMargin = 260;

    // canvas properties
    this.canvas = document.getElementById("canvas1");
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.context = this.canvas.getContext("2d");
    this.context.fillStyle = "white";
    this.context.strokeStyle = "white";
    this.context.lineWidth = 3;
    this.context.font = "40px Helvetica";

    // game object properties
    this.gameObjects = [];

    // player properties
    this.player = new Player(this);
    this.score = 0;

    // obstacle properties
    this.numberOfObstacles = 10;
    this.obstacles = [];
    this.minimumObstacleDistance = 80;
    this.obstacleAttempts = 5000;

    // egg properties
    this.numberOfEggs = 15;
    this.eggs = [];
    this.minimumEggDistance = 70;
    this.eggTimer = 0;
    this.eggInterval = 1000;

    // enemy properties
    this.numberOfEnemies = 8;
    this.enemies = [];
    this.minimumEnemyDistance = 70;
    this.enemyTimer = 0;
    this.enemyInterval = 1000;

    // larva properties
    this.larvas = [];
    // hatching properties
    this.hatchInterval = 5000;

    // particle properties
    this.particles = [];

    // mouse properties
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

    // key properties
    window.addEventListener("keydown", (e) => {
      if (e.key == "d") this.debug = !this.debug;
    });
  }

  render() {
    this.context.clearRect(0, 0, this.width, this.height);
    this.gameObjects = [
      this.player,
      ...this.obstacles,
      ...this.eggs,
      ...this.enemies,
      ...this.larvas,
      ...this.particles,
    ];
    this.gameObjects.sort((a, b) => a.collisionY - b.collisionY);
    this.gameObjects.forEach((object) => object.update());
    this.context.fillText(`Score: ${this.score}`, 20, 50);
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

  addObstacles() {
    let attempts = 0;
    while (
      this.obstacles.length < this.numberOfObstacles &&
      attempts < this.obstacleAttempts
    ) {
      let testObstacle = new Obstacle(this);

      let collision = false;

      // earier I added the player to the obstacles array, but that was a bad idea because the player takes space form obstacles and less obstacles can be generated
      [...this.obstacles].forEach((obstacle) => {
        const a = testObstacle;
        const b = obstacle;
        const distanceBuffer = 150;

        if (this.checkCollision(a, b, distanceBuffer)) {
          collision = true;
        }
      });

      const margin =
        testObstacle.collisionRadius + this.minimumObstacleDistance + 20;

      !collision &&
        testObstacle.spriteX > 0 &&
        testObstacle.spriteX < this.width - testObstacle.width &&
        testObstacle.collisionY > this.topMargin + margin &&
        testObstacle.collisionY < this.height - margin &&
        this.obstacles.push(testObstacle);

      attempts++;
    }
  }

  addEnemy() {
    this.enemies.push(new Enemy(this));
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

      if (
        this.enemyTimer > this.enemyInterval &&
        this.enemies.length < this.numberOfEnemies
      ) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += Math.random() * 16;
      }
    }
    window.requestAnimationFrame(this.animate.bind(this));
  }

  init() {
    this.addObstacles();
    this.animate(this.lastRender);
  }
}

export default Game;
