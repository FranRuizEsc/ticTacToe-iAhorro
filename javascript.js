// let state = [
//     [ null, null, null ],
//     [ null, null, null ],
//     [ null, null, null ]
// ];

const table = document.getElementById("game-table");
const xImage =
  "http://cdn.iahorro.com/internal-resources/it-technical-test/x.png";
const oImage =
  "http://cdn.iahorro.com/internal-resources/it-technical-test/o.png";
const newGameButton = document.getElementById("new-game-button");

// ? Crea un nuevo tablero de juego
let stateTable = createNewStateTable();

let currentPlayer = "x";
let winner = null;
let xWins = 0;
let oWins = 0;

// ? Función para crear un nuevo tablero de juego
function createNewStateTable() {
  return Array.from({ length: 3 }, () => Array(3).fill(null));
}

// ? Función para rellenar el tablero según el estado del juego
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

  // let table = document.getElementById("game-table");
  // for (let i = 0; i < state.length; i++) {
  //   let row = table.insertRow(i);
  //   for (let j = 0; j < state[i].length; j++) {
  //     let cell = row.insertCell(j);
  //     cell.innerHTML = state[i][j];
  //   }
  // }
}

// Función para determinar qué jugador debe ser el siguiente
function nextPlayer(state) {
  let xCount = 0;
  let oCount = 0;
  
  // ? convierto el tablero en un array plano y cuento las x y las o

  xCount = state.flat().filter(cell => cell === "x").length;
  oCount = state.flat().filter(cell => cell === "o").length;
  
  return xCount === oCount ? "x" : "o";



  // for (let i = 0; i < state.length; i++) {
  //   for (let j = 0; j < state[i].length; j++) {
  //     if (state[i][j] === "x") {
  //       xCount++;
  //     } else if (state[i][j] === "o") {
  //       oCount++;
  //     }
  //   }
  // }


  // if (xCount === oCount) {
  //   return "x";
  // } else {
  //   return "o";
  // }
}

// Función para determinar si hay un ganador en el juego actual
function findWinner(state) {
  let winner = null;
  let rowData = null;
  
  // ? Chequear filas
  state.forEach((row) => {
    console.log('row', row);
    rowData = row
    if (row[0] === row[1] && row[1] === row[2]) {
      winner = row[0];
    }
  })

  // for (let i = 0; i < state.length; i++) {
  //   if (state[i][0] === state[i][1] && state[i][1] === state[i][2]) {
  //     winner = state[i][0];
  //   }
  // }



  // ? Chequear columnas
  for (let i = 0; i < state.length; i++) {
    if (state[0][i] === state[1][i] && state[1][i] === state[2][i]) {
      winner = state[0][i];
    }
  }

  
  // Chequear diagonales
  if (state[0][0] === state[1][1] && state[1][1] === state[2][2]) {
    winner = state[0][0];
  }
  if (state[0][2] === state[1][1] && state[1][1] === state[2][0]) {
    winner = state[0][2];
  }
  return winner;
}

// Rellenar el tablero según el estado del juego
populate(stateTable);

// Asociar eventos a cada casilla del tablero
// let table = document.getElementById("game-table");
for (let i = 0; i < table.rows.length; i++) {
  for (let j = 0; j < table.rows[i].cells.length; j++) {
    table.rows[i].cells[j].onclick = function () {
      // Si la casilla está vacía y no hay un ganador
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

// Añadir botón "Nuevo juego"
// let newGameButton = document.createElement("button");
// newGameButton.innerHTML = "Nuevo juego";
// newGameButton.onclick = function() {
//     state = [
//         [ null, null, null ],
//         [ null, null, null ],
//         [ null, null, null ]
//     ];
//     currentPlayer = 'x';
//     winner = null;
//     for (let i = 0; i < table.rows.length; i++) {
//         for (let j = 0; j < table.rows[i].cells.length; j++) {
//             table.rows[i].cells[j].innerHTML = "";
//         }
//     }
//     document.getElementById("next-player").innerHTML = currentPlayer;
// }

// document.body.prepend(newGameButton);

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
  }
}

// Función para manejar el evento onClick
function onClick() {
  if (this.innerHTML === "" && winner === null) {
    this.innerHTML = `<img src="${
      currentPlayer === "x" ? xImage : oImage
    }" alt="${currentPlayer}">`;
    // this.innerHTML = currentPlayer;
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
    }
  }
}

// Función para reiniciar el juego
function reset() {
  //? resetea el tablero de juego
  stateTable = createNewStateTable();
  currentPlayer = "x";
  winner = null;

  // ? Convierto los elementos td en un array y recorro cada uno para limpiarlos
  Array.from(table.getElementsByTagName("td")).forEach((cell) => {
    cell.innerHTML = "";
    cell.classList.remove("winner");
  });

  //   let state = [
  //     [ null, null, null ],
  //     [ null, null, null ],
  //     [ null, null, null ]
  // ];

  // for (let i = 0; i < table.rows.length; i++) {
  //   for (let j = 0; j < table.rows[i].cells.length; j++) {
  //     table.rows[i].cells[j].innerHTML = "";
  //     table.rows[i].cells[j].classList.remove("winner");
  //   }
  // }

  document.getElementById("next-player").innerHTML = currentPlayer;
}

// Función para determinar si hay un empate
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

// Añadir eventos onClick a cada casilla del tablero
for (let i = 0; i < table.rows.length; i++) {
  for (let j = 0; j < table.rows[i].cells.length; j++) {
    table.rows[i].cells[j].onclick = onClick;
  }
}

// Añadir evento onClick al botón "Nuevo juego"
newGameButton.onclick = reset;
