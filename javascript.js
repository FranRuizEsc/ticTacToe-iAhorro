// ? constantes para el tablero de juego
const table = document.getElementById("game-table");

// ? constantes para las imágenes del tablero
const xImage =
  "http://cdn.iahorro.com/internal-resources/it-technical-test/x.png";
const oImage =
  "http://cdn.iahorro.com/internal-resources/it-technical-test/o.png";
const alternativeXImage =
  "http://cdn.iahorro.com/internal-resources/it-technical-test/x2.png";
const alternativeOImage =
  "http://cdn.iahorro.com/internal-resources/it-technical-test/o2.png";

// ? constantes para los subtulos del tablero
const startSubtitle = document.getElementById("start-game-subtitle");
const nextPlayerSubtitle = document.getElementById("next-player-subtitle");

const xWinsElement = document.getElementById("x-wins");
const oWinsElement = document.getElementById("o-wins");

// ? constante para el botón de nuevo juego
const newGameButton = document.getElementById("new-game-button");

// ? constante para el span de siguiente jugador
const nextPlayerElement = document.getElementById("next-player");

const dialog = document.getElementById('dialog');


let isAlternativeImages = false;

// ? Crea un nuevo tablero de juego
let stateTable = createNewStateTable();

let currentPlayer = "x";
let winner = null;
let xWins = 0;
let oWins = 0;

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

// ? segun el estado de isAlternativeImages, devuelvo las imágenes alternativas o las normales
// * Función para obtener las imágenes actuales
function getCurrentImages() {
  return isAlternativeImages
    ? { x: alternativeXImage, o: alternativeOImage }
    : { x: xImage, o: oImage };
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
}

// * Función para crear un nuevo tablero de juego
function createNewStateTable() {
  return Array.from({ length: 3 }, () => Array(3).fill(null));
}

// * Función para rellenar el tablero según el estado del juego
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

// * Función para determinar qué jugador debe ser el siguiente
function nextPlayer(state) {
  let xCount = 0;
  let oCount = 0;

  // ? convierto el tablero en un array plano y cuento las x y las o

  xCount = state.flat().filter((cell) => cell === "x").length;
  oCount = state.flat().filter((cell) => cell === "o").length;

  return xCount === oCount ? "x" : "o";
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

// ? Creao esta función porque es buena práctica no tener el código de inicialización en el global
// ? Además es más legible y fácil de mantener

// * Asociar eventos a cada casilla del tablero
function initializeGameBoard() {
  for (let i = 0; i < table.rows.length; i++) {
    for (let j = 0; j < table.rows[i].cells.length; j++) {
      // ? Asocio el evento onClick a la función handleClick por que he adaptado a la nueva funcionalidad y hace lo mismo
      // ? así no duplico código y es más escalable y reutilizable
      table.rows[i].cells[j].onclick = handleClick;
    }
  }
}

// ? Rellenar el tablero según el estado del juego
populate(stateTable);

// ? Deshabilitar el botón de nuevo juego
newGameButton.disabled = true;

// ? Inicializar los subtitulos
initializeSubtitles();

initializeGameBoard();

// ? He borrado la creación del botón por que creo que es mejor hacer en html por que siempre va a ser visible
// ? También he borrado la funcionalidad por que esta duplicada enla función reset

// * Función para mostrar el diálogo según el ganador
function showDialog(winner) {
// ? No hago estas constantes locales por que no se van a usar fuera de la función
  const dialogTitle = document.getElementById('dialog-title');
  const dialogSubtitle = document.getElementById('dialog-subtitle');
  const dialogIcon = document.getElementById('dialog-icon');
  const images = getCurrentImages();
  const image = dialog.querySelector("img");
  
  
  if(winner) {
    dialogTitle.innerHTML = '¡Felicidades!';
    dialogSubtitle.innerHTML = 'Has ganado el juego.';
    dialogIcon.classList.add('fas', 'fa-glass-cheers');
    image.src = winner === "x" ? images.x : images.o;
  } else {
    dialogTitle.innerHTML = '¡Empate!';
    dialogSubtitle.innerHTML = 'Inténtalo de nuevo.';
    dialogIcon.classList.add('fa-solid', 'fa-scale-balanced');    
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

// * Función para actualizar el color de la celda
function updateCellColor(cell, player) {
  clearCellClasses(cell);
  const colorClass = isAlternativeImages
    ? `${player}-cell-alternative`
    : `${player}-cell`;
  cell.classList.add(colorClass);
}

// TODOFunción para manejar el evento onClick
function handleClick() {
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
      updateScore();
    } else if (checkTie()) {
      play();
      updateScore();
    } else {
      currentPlayer = nextPlayer(stateTable);
      nextPlayerElement.innerHTML = currentPlayer;
      updateNextPlayerDisplay();
    }
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

// * Función para determinar si hay un empate
// ! Con el metodo flat() convierto el tablero en un array plano
// ! El método .every() verifica si todos los elementos de un array cumplen una condición.
// ! Devuelve true si todos cumplen la condición, y false si al menos uno no la cumple.

function checkTie() {
  // ? Con every comprueba que todas las celdas sean distintas de null y devuelve true si es así
  return stateTable.flat().every((cell) => cell !== null);
}

// ? He borrado el código por que ya no es necesario
// Añadir eventos onClick a cada casilla del tablero
// for (let i = 0; i < table.rows.length; i++) {
//   for (let j = 0; j < table.rows[i].cells.length; j++) {
//     table.rows[i].cells[j].onclick = onClick;
//   }
// }

// ? Ya no es necesario añadir evento onClick al botón "Nuevo juego"
// newGameButton.onclick = reset;
