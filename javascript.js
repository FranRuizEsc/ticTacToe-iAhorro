const table = document.getElementById("game-table");

const xImage =
  "http://cdn.iahorro.com/internal-resources/it-technical-test/x.png";
const oImage =
  "http://cdn.iahorro.com/internal-resources/it-technical-test/o.png";
const alternativeXImage =
  "http://cdn.iahorro.com/internal-resources/it-technical-test/x2.png";
const alternativeOImage =
  "http://cdn.iahorro.com/internal-resources/it-technical-test/o2.png";

const startSubtitle = document.getElementById("start-game-subtitle");
const nextPlayerSubtitle = document.getElementById("next-player-subtitle");
const nextPlayerSpan = document.getElementById("next-player");

let isAlternativeImages = false;
const newGameButton = document.getElementById("new-game-button");

// ? Crea un nuevo tablero de juego
let stateTable = createNewStateTable();

let currentPlayer = "x";
let winner = null;
let xWins = 0;
let oWins = 0;

// ? Función para inicializar los subtitulos y mostrar !empezamos!
function initializeSubtitles() {
  startSubtitle.style.display = "block";
  nextPlayerSubtitle.style.display = "none";
}

// ? Función para actualizar el subtitulo de siguiente jugador y mostrar la imagen del jugador
function updateNextPlayerDisplay() {
  startSubtitle.style.display = "none";
  nextPlayerSubtitle.style.display = "block";
  const currentImages = getCurrentImages();
  nextPlayerSpan.innerHTML = `<img src="${currentImages[currentPlayer]}" class="player-icon">`;
}

// ? Función para obtener las imágenes actuales
function getCurrentImages() {
  return isAlternativeImages
    ? { x: alternativeXImage, o: alternativeOImage }
    : { x: xImage, o: oImage };
}

// ? Función para cambiar las imágenes
function toggleImages() {
  isAlternativeImages = !isAlternativeImages;
  const images = getCurrentImages();

  // ? Actualizar las imágenes y colores en el tablero
  Array.from(table.getElementsByTagName("td")).forEach((cell) => {
    const img = cell.querySelector("img");
    if (img) {
      const player = img.alt;
      img.src = images[player];
      updateCellColor(cell, player);
    }
  });

  // ? Actualizar las imágenes del marcador
  document.querySelector(".info-score-item:first-child img").src = images.x;
  document.querySelector(".info-score-item:last-child img").src = images.o;
}

// ? Función para crear un nuevo tablero de juego
function createNewStateTable() {
  return Array.from({ length: 3 }, () => Array(3).fill(null));
}

// TODO Función para rellenar el tablero según el estado del juego
function populate(state) {
  if (!table) {
    console.log("No se ha encontrado game-table");
    return;
  }

  state.forEach((rowData, i) => {
    let row = table.insertRow(i);
    rowData.forEach((cellData, j) => {
      let cell = row.insertCell(j);
      cell.innerHTML = cellData || null;
    });
  });
}

// TODO Función para determinar qué jugador debe ser el siguiente
function nextPlayer(state) {
  let xCount = 0;
  let oCount = 0;

  // ? convierto el tablero en un array plano y cuento las x y las o

  xCount = state.flat().filter((cell) => cell === "x").length;
  oCount = state.flat().filter((cell) => cell === "o").length;

  return xCount === oCount ? "x" : "o";
}

// TODO Función para determinar si hay un ganador en el juego actual
function findWinner(state) {
  let winner = null;
  let rowData = null;

  // TODO Chequear filas
  state.forEach((row) => {
    console.log("row", row);
    rowData = row;
    if (row[0] === row[1] && row[1] === row[2]) {
      winner = row[0];
    }
  });

  // TODO Chequear columnas
  for (let i = 0; i < state.length; i++) {
    if (state[0][i] === state[1][i] && state[1][i] === state[2][i]) {
      winner = state[0][i];
    }
  }

  // TODO Chequear diagonales
  if (state[0][0] === state[1][1] && state[1][1] === state[2][2]) {
    winner = state[0][0];
  }
  if (state[0][2] === state[1][1] && state[1][1] === state[2][0]) {
    winner = state[0][2];
  }
  return winner;
}

// ? Rellenar el tablero según el estado del juego
populate(stateTable);

// ? Deshabilitar el botón de nuevo juego
newGameButton.disabled = true;

// ? Inicializar los subtitulos
initializeSubtitles();

// TODOsociar eventos a cada casilla del tablero
for (let i = 0; i < table.rows.length; i++) {
  for (let j = 0; j < table.rows[i].cells.length; j++) {
    table.rows[i].cells[j].onclick = function () {
      //  TODO Si la casilla está vacía y no hay un ganador
      if (stateTable[i][j] === null && winner === null) {
        stateTable[i][j] = currentPlayer;
        this.innerHTML = currentPlayer;
        winner = findWinner(stateTable);
        if (winner === "x") {
          xWins++;
          alert("X wins!");
        } else if (winner === "o") {
          oWins++;
          alert("O wins!");
        } else {
          currentPlayer = nextPlayer(stateTable);
          document.getElementById("next-player").innerHTML = currentPlayer;
        }
        document.getElementById("x-wins").innerHTML = xWins;
        document.getElementById("o-wins").innerHTML = oWins;
      }
    };
  }
}

// ? He borrado la creación del botón por que creo que es mejor hacer en html por que siempre va a ser visible
// ? También he borrado la funcionalidad por que esta duplicada enla función reset

// TODO Función para determinar si hay un ganador o un empate
function play() {
  winner = findWinner(stateTable);
  if (winner) {
    alert(winner + " wins!");
    if (winner === "x") {
      xWins++;
    } else {
      oWins++;
    }
    document.getElementById("x-wins").innerHTML = xWins;
    document.getElementById("o-wins").innerHTML = oWins;
  } else if (checkTie()) {
    alert("Tie!");
  } else {
    currentPlayer = nextPlayer(stateTable);
    document.getElementById("next-player").innerHTML = currentPlayer;
    updateNextPlayerDisplay();
  }
}

// ? Función para actualizar el color de la celda
function updateCellColor(cell, player) {
  cell.classList.remove(
    "x-cell",
    "o-cell",
    "x-cell-alternative",
    "o-cell-alternative"
  );
  const colorClass = isAlternativeImages
    ? `${player}-cell-alternative`
    : `${player}-cell`;
  cell.classList.add(colorClass);
}

// TODOFunción para manejar el evento onClick
function onClick() {
  newGameButton.disabled = false;
  if (this.innerHTML === "" && winner === null) {
    // ? oculta el subtitulo de inicio y muestra el de siguiente jugador
    updateNextPlayerDisplay();
    const currentImages = getCurrentImages();
    this.innerHTML = `<img src="${
      currentPlayer === "x" ? currentImages.x : currentImages.o
    }" alt="${currentPlayer}">`;

    updateCellColor(this, currentPlayer);

    let row = this.parentNode.rowIndex;
    let col = this.cellIndex;
    stateTable[row][col] = currentPlayer;

    winner = findWinner(stateTable);
    if (winner) {
      this.classList.add("winner");
      play();
    } else if (checkTie()) {
      play();
    } else {
      currentPlayer = nextPlayer(stateTable);
      document.getElementById("next-player").innerHTML = currentPlayer;
      updateNextPlayerDisplay();
    }
  }
}

// TODO Función para reiniciar el juego
function reset() {
  //? resetea el tablero de juego
  stateTable = createNewStateTable();
  currentPlayer = "x";
  winner = null;

  // ? Convierto los elementos td en un array y recorro cada uno para limpiarlos
  Array.from(table.getElementsByTagName("td")).forEach((cell) => {
    cell.innerHTML = "";
    cell.classList.remove(
      "winner",
      "x-cell",
      "o-cell",
      "x-cell-alternative",
      "o-cell-alternative"
    );
  });

  // ? Inicializa los subtitulos
  initializeSubtitles();

  document.getElementById("next-player").innerHTML = currentPlayer;
}

// TODO Función para determinar si hay un empate
function checkTie() {
  for (let i = 0; i < stateTable.length; i++) {
    for (let j = 0; j < stateTable[i].length; j++) {
      if (stateTable[i][j] === null) {
        return false;
      }
    }
  }
  return true;
}

// TODO Añadir eventos onClick a cada casilla del tablero
for (let i = 0; i < table.rows.length; i++) {
  for (let j = 0; j < table.rows[i].cells.length; j++) {
    table.rows[i].cells[j].onclick = onClick;
  }
}

// ? Ya no es necesario añadir evento onClick al botón "Nuevo juego"
// newGameButton.onclick = reset;
