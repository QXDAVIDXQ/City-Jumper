const gameArea = document.getElementById("game-area");
const player = document.getElementById("player");
const scoreElement = document.getElementById("score");
const messageElement = document.getElementById("message");

let playerPosition = 10;
let playerSpeed = 0;
let runningDistance = 0;
let isGameRunning = false;
let obstacles = [];
let gameInterval;
let obstacleInterval;

// Funktion, um den Spieler zu bewegen
function movePlayer() {
  if (isGameRunning) {
    player.style.bottom = playerPosition + "px";
    playerPosition += playerSpeed;

    // Gravitationswirkung
    if (playerPosition > 10) {
      playerSpeed = -1; // Fallgeschwindigkeit
    }

    // Kollision mit dem Boden
    if (playerPosition <= 10) {
      playerPosition = 10;
      playerSpeed = 0;
    }
  }
}

// Funktion, um das Spiel zu starten
function startGame() {
  isGameRunning = true;
  playerPosition = 10;
  playerSpeed = 0;
  runningDistance = 0;
  obstacles = [];
  scoreElement.textContent = `Meter gelaufen: ${runningDistance}`;
  messageElement.textContent = "Viel Spaß beim Spielen!";
  gameInterval = setInterval(gameLoop, 20);
  obstacleInterval = setInterval(generateObstacle, 2000);
}

// Spiel-Loop
function gameLoop() {
  movePlayer();
  runningDistance++;
  scoreElement.textContent = `Meter gelaufen: ${runningDistance}`;
  checkCollisions();
  moveObstacles();
}

// Funktion, um Hindernisse zu generieren
function generateObstacle() {
  const obstacleHeight = Math.random() * 50 + 30;
  const gapPosition = Math.random() * (gameArea.offsetHeight - obstacleHeight);
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  obstacle.style.height = `${obstacleHeight}px`;
  obstacle.style.left = `${gameArea.offsetWidth}px`;
  obstacle.style.bottom = `${gapPosition}px`;
  gameArea.appendChild(obstacle);
  obstacles.push(obstacle);
}

// Funktion, um Hindernisse zu bewegen
function moveObstacles() {
  obstacles.forEach((obstacle, index) => {
    let left = parseInt(obstacle.style.left);
    left -= 3; // Geschwindigkeit der Hindernisse
    obstacle.style.left = left + "px";

    if (left < -50) {
      gameArea.removeChild(obstacle);
      obstacles.splice(index, 1);
    }
  });
}

// Funktion, um Kollisionen zu überprüfen
function checkCollisions() {
  obstacles.forEach((obstacle) => {
    const obstacleRect = obstacle.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      playerRect.right > obstacleRect.left &&
      playerRect.left < obstacleRect.right &&
      playerRect.bottom > obstacleRect.top &&
      playerRect.top < obstacleRect.bottom
    ) {
      // Kollision erkannt, Spiel neu starten
      endGame();
    }
  });
}

// Funktion, um das Spiel zu beenden
function endGame() {
  isGameRunning = false;
  clearInterval(gameInterval);
  clearInterval(obstacleInterval);
  messageElement.textContent = `Du bist gefallen! Du bist ${runningDistance} Meter gelaufen. Drücke 'Space', um neu zu starten.`;
}

// Springen
document.addEventListener("keydown", (event) => {
  if (event.code === "Space" && isGameRunning) {
    playerSpeed = 10; // Sprungkraft
  }

  if (event.code === "Space" && !isGameRunning) {
    startGame();
  }
});

// Beim Laden der Seite das Spiel starten
startGame();
