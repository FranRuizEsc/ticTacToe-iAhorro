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
const xWinsElement = document.getElementById("x-wins");
const oWinsElement = document.getElementById("o-wins");
const newGameButton = document.getElementById("new-game-button");
const nextPlayerElement = document.getElementById("next-player");
const dialog = document.getElementById("dialog");
const dialogIcon = document.getElementById("dialog-icon");
const dialogImage = dialog.querySelector("img");

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
		row.classList.add("game-row");
		rowData.forEach((cellData, cellIndex) => {
			let cell = row.insertCell(cellIndex);
			cell.classList.add("game-cell");
			cell.innerHTML = cellData || null;
		});
	});
}

// * Función para gestionar los subtitulos.
function handleSubtitle(isInnitialSubtitle){
	startSubtitle.style.display = isInnitialSubtitle ? "block" : "none";
	nextPlayerSubtitle.style.display = isInnitialSubtitle ? "none" : "block";
	
	if(!isInnitialSubtitle){
		const currentImages = getCurrentImages();	
		nextPlayerElement.innerHTML = `<img src="${currentImages[currentPlayer]}" class="player-icon">`;
	}
}

// * Función para determinar si hay un ganador en el juego actual
function findWinner(state) {

	// ? Array con las lineas ganadoras para evitar hacer tantas comprobaciones
	const winningLines = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];

	// ? Recorro el array de lineas ganadoras
    for (const line of winningLines) {
		// ? Desgloso la linea ganadora en sus 3 celdas
        const [[r1, c1], [r2, c2], [r3, c3]] = line;
		// ? Compruebo si las 3 celdas tienen el mismo valor y son iguales
        if (state[r1][c1] && state[r1][c1] === state[r2][c2] && state[r2][c2] === state[r3][c3]) {
            highlightWinner(line);
			// ? Devuelvo el valor de la celda ganadora
            return state[r1][c1];
        }
    }

    return null;
}

// * Función para resaltar la linea ganadora
function highlightWinner(cells){
	if (!cells) return null;

	// ? Recorro el array de celdas y añado la clase line-winner a cada una
	cells.forEach(([row, col]) => {
		table.rows[row].cells[col].classList.add('line-winner');
	});
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
	const images = getCurrentImages();	

	if (winner) {
		dialogTitle.innerHTML = "¡Felicidades!";
		dialogSubtitle.innerHTML = "Has ganado el juego.";
		dialogIcon.classList.add("fas", "fa-glass-cheers");
		dialogImage.src = winner === "x" ? images.x : images.o;
	} else {
		dialogTitle.innerHTML = "¡Empate!";
		dialogSubtitle.innerHTML = "Inténtalo de nuevo.";
		dialogIcon.classList.add("fa-solid", "fa-scale-balanced");
		dialogImage.classList.add('hidden');
	}
	dialog.showModal();
}

// * Función que cierra el diálogo y reinicia el juego
function closeDialog() {
	dialogImage.classList.remove('hidden');
	dialogIcon.classList.remove("fa-solid", "fa-scale-balanced", "fas", "fa-glass-cheers");
	dialog.close();
	resetGame();
}

// * Función para determinar si hay un ganador o un empate
function handleTurn() {
	if (!stateTable) return;
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
	}
	handleSubtitle(false);
}

// * Función para manejar el evento onClick
function handleClick() {
	if (!stateTable) return;

	newGameButton.disabled = false;
	if (this.innerHTML === "" && winner === null) {
		const currentImages = getCurrentImages();
		this.innerHTML = `<img src="${currentPlayer === "x" ? currentImages.x : currentImages.o
			}" alt="${currentPlayer}">`;

		updateCellColor(this, currentPlayer);

		let row = this.parentNode.rowIndex;
		let col = this.cellIndex;

		stateTable[row][col] = currentPlayer;

		handleTurn();
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
		cell.classList.remove('line-winner');
		clearCellClasses(cell);
	});

	// ? Inicializa los subtitulos
	handleSubtitle(true);
}

// * Asociar eventos a cada casilla del tablero
function initializeGameBoard() {
	if (!table) return;
	for (let i = 0; i < table.rows.length; i++) {
		for (let j = 0; j < table.rows[i].cells.length; j++) {
			// ? Asocio el evento onClick a la función handleClick por que he adaptado a la nueva funcionalidad y hace lo mismo
			// ? así no duplico código y es más escalable y reutilizable.
			table.rows[i].cells[j].onclick = handleClick;

			// ? Asigno tabindex 0 a cada celda para que se pueda navegar con el tablero.
			table.rows[i].cells[j].setAttribute("tabindex", "0");

			// ? Asigno el evento keydown enter a cada celda para que agregue la imagen correspondiente.
			table.rows[i].cells[j].addEventListener("keydown", (event) => {
				if (event.key === "Enter") {
					handleClick.call(table.rows[i].cells[j]);
				}
			});
		}
	}
}

// * Función para manejar la navegación por el tablero con el teclado
function handleKeyboardNavigation() {
	if (!table) return;
	
	let currentRow = 0;
	let currentColumn = 0;

	table.addEventListener("keydown", (event) => {
		const rows = table.rows;
		const currentCells = rows[currentRow].cells;

		switch (event.key) {
			case "ArrowUp":
				// ? Comprueba si la fila actual no es la primera y si es así resta 1 a la fila actual
				if (currentRow > 0) {
					currentRow--;
				}
				break;
			case "ArrowDown":
				// ? Comprueba si la fila actual no es la última y si es así suma 1 a la fila actual
				if (currentRow < rows.length - 1) {
					currentRow++;
				}
				break;
			case "ArrowLeft":
				// ? Comprueba si la columna actual no es la primera y si es así resta 1 a la columna actual
				if (currentColumn > 0) {
					currentColumn--;
				}
				break;
			case "ArrowRight":
				// ? Comprueba si la columna actual no es la última y si es así suma 1 a la columna actual
				if (currentColumn < currentCells.length - 1) {
					currentColumn++;
				}
				break;
		}

		// ? Se añade el foco a la celda que está en la posición actual
		rows[currentRow].cells[currentColumn].focus();
	});
}

populate(stateTable);
newGameButton.disabled = true;
handleSubtitle(true);
initializeGameBoard();
handleKeyboardNavigation();

// * Evita que se cierre el diálogo automaticamente cuando se esta pulsando enter en el tablero.
document.addEventListener("keydown", (event) => {
	if (event.key === "Enter" && dialog.open) {
		event.preventDefault();
	}
});
