window.addEventListener('load', function() {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 1280;
  canvas.height = 720;

  class Player {

    constructor(game) {
      if (typeof Player.instance === "object") {
        return Player.instance;
      }
      Player.instance = this;
      this.game = game;
    }
  }

  class Game {

    constructor(canvas) {
      if (typeof Game.instance === "object") {
        return Game.instance;
      }
      Game.instance = this;
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.player = new Player(this);
    }
  }

  const game = new Game(canvas);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(animate);
  }
});