const gameArea = document.getElementById("game-area");
const player = document.getElementById("player");
const scoreElement = document.getElementById("score");
const messageElement = document.getElementById("message");

let playerPosition = 10;
let playerSpeed = 0;
let runningDistance = 0;
let isGameRunning = false;
let houses = [];
let gapWidth = 200; // Abstand zwischen den Häusern
let gameInterval;
let lastHousePosition = 0;

// Funktion, um den Spieler zu bewegen
function movePlayer() {
  if (isGameRunning) {
    player.style.bottom = playerPosition + "px";
    playerPosition += playerSpeed;

    // Gravitationswirkung (Spieler fällt nach unten)
    if (playerPosition > 10) {
      playerSpeed = -1; // Fallgeschwindigkeit
    }

    // Kollision mit dem Boden (falls der Spieler den Boden erreicht)
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
  houses = [];
  gapWidth = 200; // Der Abstand zwischen den Häusern
  lastHousePosition = 0;
  scoreElement.textContent = `Meter gelaufen: ${runningDistance}`;
  messageElement.textContent = "Viel Spaß beim Spielen!";
  gameInterval = setInterval(gameLoop, 20);
  generateHouse();
}

// Spiel-Loop
function gameLoop() {
  movePlayer();
  runningDistance++;
  scoreElement.textContent = `Meter gelaufen: ${runningDistance}`;

  // Generiere neue Häuser, wenn das letzte Haus das Ende erreicht hat
  if (lastHousePosition < gameArea.offsetWidth - 100) {
    generateHouse();
  }

  // Bewege die Häuser nach links
  moveHouses();

  // Überprüfe, ob der Spieler aus dem Spiel fällt
  checkFall();
}

// Funktion, um ein Haus zu generieren
function generateHouse() {
  const house = document.createElement("div");
  house.classList.add("house");

  // Bestimme den Abstand zwischen den Häusern
  const gap = Math.random() * (gapWidth - 100) + 100; // Variiert die Lücke zwischen den Häusern
  house.style.left = `${lastHousePosition + gap}px`; // Positioniere das Haus
  lastHousePosition = parseInt(house.style.left); // Speichere die Position des letzten Hauses

  // Positioniere das Haus zufällig mit einer Lücke dazwischen
  gameArea.appendChild(house);
  houses.push(house);
}

// Funktion, um die Häuser zu bewegen
function moveHouses() {
  houses.forEach((house, index) => {
    let left = parseInt(house.style.left);
    left -= 3; // Geschwindigkeit der Häuser

    // Entferne Häuser, die aus dem Bildschirm raus sind
    if (left < -100) {
      gameArea.removeChild(house);
      houses.splice(index, 1);
    } else {
      house.style.left = left + "px";
    }
  });
}

// Funktion, um zu überprüfen, ob der Spieler gefallen ist
function checkFall() {
  houses.forEach((house) => {
    const houseRect = house.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      playerRect.right > houseRect.left &&
      playerRect.left < houseRect.right &&
      playerRect.bottom < houseRect.top &&
      playerRect.top > houseRect.top
    ) {
      // Wenn der Spieler den Boden verfehlt, muss er fallen
      if (playerRect.bottom <= houseRect.top) {
        return;
      } else {
        // Kollision erkannt, Spiel neu starten
        endGame();
      }
    }
  });
}

// Funktion, um das Spiel zu beenden
function endGame() {
  isGameRunning = false;
  clearInterval(gameInterval);
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
