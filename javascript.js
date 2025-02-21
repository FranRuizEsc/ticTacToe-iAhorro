const table = document.getElementById("game-table");

const xImage = "http://cdn.iahorro.com/internal-resources/it-technical-test/x.png";
const oImage = "http://cdn.iahorro.com/internal-resources/it-technical-test/o.png";
const alternativeXImage = "http://cdn.iahorro.com/internal-resources/it-technical-test/x2.png";
const alternativeOImage = "http://cdn.iahorro.com/internal-resources/it-technical-test/o2.png";


const startSubtitle = document.getElementById("start-game-subtitle");
const nextPlayerSubtitle = document.getElementById("next-player-subtitle");
const xWinsElement = document.getElementById("x-wins");
const oWinsElement = document.getElementById("o-wins");
const newGameButton = document.getElementById("new-game-button");
const nextPlayerElement = document.getElementById("next-player");
const dialog = document.getElementById("dialog");

let isAlternativeImages = false;
let stateTable = createNewStateTable();
let currentPlayer = "x";
let winner = null;
let xWins = 0;
let oWins = 0;


// * Función para crear un nuevo tablero de juego
function createNewStateTable() {
  return Array.from({ length: 3 }, () => Array(3).fill(null));
}

// ? segun el estado de isAlternativeImages, devuelvo las imágenes alternativas o las normales
// * Función para obtener las imágenes actuales
function getCurrentImages() {
  return isAlternativeImages
    ? { x: alternativeXImage, o: alternativeOImage }
    : { x: xImage, o: oImage };
}

// * Función para borrar las clases de las celdas
function clearCellClasses(cell) {
  cell.classList.remove(
    "winner",
    "x-cell",
    "o-cell",
    "x-cell-alternative",
    "o-cell-alternative"
  );
}

// * Función para cambiar las imágenes
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
  nextPlayerElement.innerHTML = `<img src="${images[currentPlayer]}" class="player-icon">`;
}


// * Función para actualizar el color de la celda
function updateCellColor(cell, player) {
  clearCellClasses(cell);
  const colorClass = isAlternativeImages
    ? `${player}-cell-alternative`
    : `${player}-cell`;
  cell.classList.add(colorClass);
}

// * Función para determinar qué jugador debe ser el siguiente
function nextPlayer(state) {
  let xCount = 0;
  let oCount = 0;

  // ? convierto el tablero en un array plano y cuento las x y las o

  xCount = state.flat().filter((cell) => cell === "x").length;
  oCount = state.flat().filter((cell) => cell === "o").length;

  return xCount === oCount ? "x" : "o";
}

// * Función para determinar si hay un empate
// ! Con el metodo flat() convierto el tablero en un array plano
// ! El método .every() verifica si todos los elementos de un array cumplen una condición.
// ! Devuelve true si todos cumplen la condición, y false si al menos uno no la cumple.s

function checkTie() {
  // ? Con every comprueba que todas las celdas sean distintas de null y devuelve true si es así
  return stateTable.flat().every((cell) => cell !== null);
}


// * Función para rellenar el tablero según el estado del juego
function populate(state) {
  if (!table) {
    console.log("No se ha encontrado game-table");
    return;
  }

  state.forEach((rowData, rowIndex) => {
    let row = table.insertRow(rowIndex);
    rowData.forEach((cellData, cellIndex) => {
      let cell = row.insertCell(cellIndex);
      cell.innerHTML = cellData || null;
    });
  });
}

// * Función para inicializar los subtitulos y mostrar !empezamos!
function initializeSubtitles() {
  startSubtitle.style.display = "block";
  nextPlayerSubtitle.style.display = "none";
}

// * Función para actualizar el subtitulo de siguiente jugador y mostrar la imagen del jugador
function updateNextPlayerDisplay() {
  startSubtitle.style.display = "none";
  nextPlayerSubtitle.style.display = "block";
  const currentImages = getCurrentImages();
  nextPlayerElement.innerHTML = `<img src="${currentImages[currentPlayer]}" class="player-icon">`;
}

// * Función para determinar si hay un ganador en el juego actual
function findWinner(state) {
  // ? Chequear filas y columnas juntas
  // ? Hago el return cada if para que no se siga ejecutando el bucle

  // ? Para las filas introduzco el index en el primer parametro de state[i]
  for (let i = 0; i < 3; i++) {
    // ? Devuelve el ganador en una fila
    if (
      state[i][0] &&
      state[i][0] === state[i][1] &&
      state[i][1] === state[i][2]
    ) {
      return state[i][0];
    }

    // ? Para las columnas introduzco el index en el segundo parametro de state[0][i]
    // ? Devuelve el ganador en una columna
    if (
      state[0][i] &&
      state[0][i] === state[1][i] &&
      state[1][i] === state[2][i]
    ) {
      return state[0][i];
    }
  }

  // ? Chequear diagonales
  if (
    (state[0][0] === state[1][1] && state[1][1] === state[2][2]) ||
    (state[0][2] === state[1][1] && state[1][1] === state[2][0])
  ) {
    // ? Devuelve el ganador en una diagonal
    return state[1][1];
  }

  return null;
}

// * Función para actualizar el marcador
function updateScore() {
  xWinsElement.innerHTML = xWins;
  oWinsElement.innerHTML = oWins;
}

// * Función para mostrar el diálogo según el ganador
function showDialog(winner) {
  // ? No hago estas constantes globales por que no se van a usar fuera de la función
  const dialogTitle = document.getElementById("dialog-title");
  const dialogSubtitle = document.getElementById("dialog-subtitle");
  const dialogIcon = document.getElementById("dialog-icon");
  const images = getCurrentImages();
  const image = dialog.querySelector("img");

  if (winner) {
    dialogTitle.innerHTML = "¡Felicidades!";
    dialogSubtitle.innerHTML = "Has ganado el juego.";
    dialogIcon.classList.add("fas", "fa-glass-cheers");
    image.src = winner === "x" ? images.x : images.o;
  } else {
    dialogTitle.innerHTML = "¡Empate!";
    dialogSubtitle.innerHTML = "Inténtalo de nuevo.";
    dialogIcon.classList.add("fa-solid", "fa-scale-balanced");
    image.style.display = "none";
  }
  dialog.showModal();
}

// * Función que cierra el diálogo y reinicia el juego
function closeDialog() {
  dialog.close();
  resetGame();
}

// * Función para determinar si hay un ganador o un empate
function play() {
  if(!stateTable) return
  winner = findWinner(stateTable);
  if (winner) {
    winner === "x" ? xWins++ : oWins++;
    updateScore();
    showDialog(winner);
  } else if (checkTie()) {
    showDialog(winner);
  } else {
    currentPlayer = nextPlayer(stateTable);
    nextPlayerElement.innerHTML = currentPlayer;
    updateNextPlayerDisplay();
  }
}

// * Función para manejar el evento onClick
function handleClick() {
  if(!stateTable) return

  newGameButton.disabled = false;
  if (this.innerHTML === "" && winner === null) {
    const currentImages = getCurrentImages();
    this.innerHTML = `<img src="${
      currentPlayer === "x" ? currentImages.x : currentImages.o
    }" alt="${currentPlayer}">`;

    updateCellColor(this, currentPlayer);

    let row = this.parentNode.rowIndex;
    let col = this.cellIndex;

    stateTable[row][col] = currentPlayer;

    play()
  }
}

// * Función para reiniciar el juego
function resetGame() {
  //? resetea el tablero de juego
  stateTable = createNewStateTable();
  currentPlayer = "x";
  winner = null;
  newGameButton.disabled = true;

  // ? Convierto los elementos td en un array y recorro cada uno para limpiarlos
  // ! Array from convierte la colleccion de HTML en un array paara poder reocrrerlo
  // ! y resetaer los valores de cada celda
  Array.from(table.getElementsByTagName("td")).forEach((cell) => {
    cell.innerHTML = "";
    clearCellClasses(cell);
  });

  // ? Inicializa los subtitulos
  initializeSubtitles();

  nextPlayerElement.innerHTML = currentPlayer;
}

// * Asociar eventos a cada casilla del tablero
function initializeGameBoard() {
  if(!table) return
  for (let i = 0; i < table.rows.length; i++) {
    for (let j = 0; j < table.rows[i].cells.length; j++) {
      // ? Asocio el evento onClick a la función handleClick por que he adaptado a la nueva funcionalidad y hace lo mismo
      // ? así no duplico código y es más escalable y reutilizable
      table.rows[i].cells[j].onclick = handleClick;
    }
  }
}


populate(stateTable);
newGameButton.disabled = true;
initializeSubtitles();
initializeGameBoard();
