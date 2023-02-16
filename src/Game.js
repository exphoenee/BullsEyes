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
    this.obstacle = [];
    this.numberOfObstacles = 10;

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
  }

  init() {
    for (let i = 0; i < this.numberOfObstacles; i++)
      this.obstacle.push(new Obstacle(this));
  }
}

export default Game;
