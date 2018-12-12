class Character {
  constructor(x, y, color, radius, speed) {
    Object.assign(this, { x, y, color, radius, speed });
  }
  draw() {
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2);
  }
  move(target) {
    if (playerHealth.value > 0) {
      this.x += (target.x - this.x) * this.speed;
      this.y += (target.y - this.y) * this.speed;
    }
  }
}

class Text {
  constructor(textContent, x, y, color, size, style, font) {
    Object.assign(this, { textContent, x, y, color, size, style, font });
  }
  display() {
    textAlign(CENTER, CENTER);
    fill(this.color);
    textSize(this.size);
    textStyle(this.style);
    textFont(this.font);
    text(this.textContent, this.x, this.y);
  }
}

const player = new Character(30, 30, "blue", 10, 0.2);
const enemies = [
  new Character(300, 0, "rgba(200,0,0,.5)", 15, 0.1),
  new Character(300, 300, "rgba(240,0,250,.2)", 17, 0.03),
  new Character(0, 300, "rgba(80,70,0,.7)", 20, 0.003),
  new Character(20, 400, "rgba(80,70,190,.7)", 12, 0.02)
];
let playerHealth = document.querySelector("#playerHealth");
let scarecrow;
let backgroundColor = "lightgreen";
let time = 0;

function updateTimer() {
  fill("grey");
  if (playerHealth.value > 0) {
    time += 1 / 60;
  }
  textSize(30);
  textAlign(RIGHT);
  text(Math.round(time), width - 10, 50);
}

function setup() {
  const canvas = createCanvas(600, 600);
  canvas.parent();
  noStroke();
}

function draw() {
  background(backgroundColor);
  if (mouseIsPressed && playerHealth.value === 0) {
    playerHealth.value = 100;
    backgroundColor = getRandomColor();
    time = 0;
  }
  newGame();
  endGame();
}

function newGame() {
  updateTimer();
  player.draw();
  enemies.forEach(enemy => enemy.draw());
  player.move({ x: mouseX, y: mouseY });
  enemies.forEach(enemy => enemy.move(scarecrow || player));
  decreasePlayerHealth();
  if (scarecrow) {
    scarecrow.draw();
    scarecrow.ttl--;
    if (scarecrow.ttl < 0) {
      scarecrow = undefined;
    }
  }
  adjust();
}

function adjust() {
  const characters = [player, ...enemies];
  for (let i = 0; i < characters.length; i++) {
    for (let j = i + 1; j < characters.length; j++) {
      pushOff(characters[i], characters[j]);
    }
  }
}

function decreasePlayerHealth() {
  for (let i = 0; i < enemies.length; i++) {
    if (enemiesHit(player, enemies[i])) {
      playerHealth.value -= 2;
    }
  }
}

function enemiesHit(player, enemy) {
  let [dx, dy] = [enemy.x - player.x, enemy.y - player.y];
  const distance = Math.hypot(dx, dy);
  let overlap = player.radius + enemy.radius - distance;
  if (overlap > 0) {
    return true;
  }
  return false;
}

function pushOff(c1, c2) {
  let [dx, dy] = [c2.x - c1.x, c2.y - c1.y];
  const distance = Math.hypot(dx, dy);
  let overlap = c1.radius + c2.radius - distance;
  if (overlap > 0) {
    dx /= distance;
    dy /= distance;
    c1.x -= dx * overlap / 2;
    c1.y -= dy * overlap / 2;
    c2.x += dx * overlap / 2;
    c2.y += dy * overlap / 2;
  }
}

function endGame() {
  if (playerHealth.value === 0) {
    background("rgba(241, 95, 95, .65)");
    const endMessage = new Text(
      "GAME OVER!",
      width / 2,
      height / 2,
      "rgb(179, 9, 9)",
      50,
      BOLD,
      "AVENIR"
    );
    const restartMessage = new Text(
      "Click to try again",
      width / 2,
      height / 2 + 30,
      "white",
      25,
      ITALIC,
      "AVENIR"
    );
    endMessage.display();
    restartMessage.display();
  }
}

function mouseClicked() {
  if (!scarecrow) {
    scarecrow = new Character(player.x, player.y, "white", 10, 0);
    scarecrow.ttl = frameRate() * 5;
  }
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
