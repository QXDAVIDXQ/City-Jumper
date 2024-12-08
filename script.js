const gameArea = document.getElementById("game-area");
const player = document.getElementById("player");
const scoreElement = document.getElementById("score");
const messageElement = document.getElementById("message");

let playerPosition = 10; // Die Position des Spielers (Y-Achse)
let playerSpeed = 0; // Geschwindigkeit des Sprungs
let runningDistance = 0; // Die zurückgelegte Strecke
let isGameRunning = false; // Status des Spiels
let houses = []; // Array für die Häuser
let gapWidth = 200; // Abstand zwischen den Häusern
let lastHousePosition = 0; // Position des letzten Hauses
let jumpPower = 0; // Sprungkraft
let currentHouse = null; // Das aktuelle Haus, auf dem der Spieler sich befindet

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
  lastHousePosition = 0;
  currentHouse = createHouse(lastHousePosition);
  scoreElement.textContent = `Meter gelaufen: ${runningDistance}`;
  messageElement.textContent = "Viel Spaß beim Spielen!";
  gameLoop();
}

// Spiel-Loop
function gameLoop() {
  movePlayer();
  runningDistance++;
  scoreElement.textContent = `Meter gelaufen: ${runningDistance}`;

  // Generiere neue Häuser, wenn das letzte Haus das Ende erreicht hat
  if (runningDistance % 500 === 0) {
    currentHouse = createHouse(lastHousePosition);
  }

  // Überprüfe, ob der Spieler gefallen ist
  checkFall();
}

// Funktion, um ein neues Haus zu generieren
function createHouse(lastHousePosition) {
  const house = document.createElement("div");
  house.classList.add("house");

  // Generiere die Position des Hauses
  const gap = Math.random() * (gapWidth - 100) + 100; // Zufällige Lücke zwischen den Häusern
  house.style.left = `${lastHousePosition + gap}px`; // Positioniere das Haus
  house.style.height = `${50}px`; // Die Höhe der Dächer bleibt gleich

  gameArea.appendChild(house);
  lastHousePosition = parseInt(house.style.left);
  houses.push(house);

  return house;
}

// Funktion, um zu überprüfen, ob der Spieler gefallen ist
function checkFall() {
  const houseRect = currentHouse.getBoundingClientRect();
  const playerRect = player.getBoundingClientRect();

  // Wenn der Spieler zu weit oder zu kurz springt, fällt er herunter
  if (playerRect.right > houseRect.right || playerRect.left < houseRect.left) {
    endGame();
  }
}

// Funktion, um das Spiel zu beenden
function endGame() {
  isGameRunning = false;
  messageElement.textContent = `Du bist gefallen! Du bist ${runningDistance} Meter gelaufen. Drücke 'Space', um neu zu starten.`;
  scoreElement.textContent = `Meter gelaufen: ${runningDistance}`;
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

// Start des Spiels
startGame();
