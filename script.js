const BOARD_SIZE = 4;
let board;

// Initialisation du jeu
function initGame() {
  board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
  addRandomTile();
  addRandomTile();
  renderBoard();
}

// Ajouter une tuile aléatoire (2 ou 4)
function addRandomTile() {
  const emptyTiles = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === 0) {
        emptyTiles.push({ row, col });
      }
    }
  }
  if (emptyTiles.length > 0) {
    const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }
}

// Afficher le plateau de jeu
function renderBoard() {
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = '';
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const tileValue = board[row][col];
      const tile = document.createElement('div');
      tile.classList.add('tile');
      if (tileValue > 0) {
        tile.textContent = tileValue;
        tile.classList.add(`tile-${tileValue}`);
      }
      gameBoard.appendChild(tile);
    }
  }
}

// Gérer les mouvements
function move(direction) {
  let moved = false;
  const oldBoard = JSON.parse(JSON.stringify(board));

  if (direction === 'left') {
    for (let row = 0; row < BOARD_SIZE; row++) {
      board[row] = slideAndMerge(board[row]);
    }
  } else if (direction === 'right') {
    for (let row = 0; row < BOARD_SIZE; row++) {
      board[row] = slideAndMerge(board[row].reverse()).reverse();
    }
  } else if (direction === 'up') {
    for (let col = 0; col < BOARD_SIZE; col++) {
      let column = [];
      for (let row = 0; row < BOARD_SIZE; row++) {
        column.push(board[row][col]);
      }
      column = slideAndMerge(column);
      for (let row = 0; row < BOARD_SIZE; row++) {
        board[row][col] = column[row];
      }
    }
  } else if (direction === 'down') {
    for (let col = 0; col < BOARD_SIZE; col++) {
      let column = [];
      for (let row = 0; row < BOARD_SIZE; row++) {
        column.push(board[row][col]);
      }
      column = slideAndMerge(column.reverse()).reverse();
      for (let row = 0; row < BOARD_SIZE; row++) {
        board[row][col] = column[row];
      }
    }
  }

  moved = JSON.stringify(oldBoard) !== JSON.stringify(board);
  if (moved) {
    addRandomTile();
    renderBoard();
    checkGameOver();
  }
}

// Fonction pour glisser et fusionner les tuiles
function slideAndMerge(row) {
  let filteredRow = row.filter(val => val !== 0);
  for (let i = 0; i < filteredRow.length - 1; i++) {
    if (filteredRow[i] === filteredRow[i + 1]) {
      filteredRow[i] *= 2;
      filteredRow[i + 1] = 0;
    }
  }
  filteredRow = filteredRow.filter(val => val !== 0);
  while (filteredRow.length < BOARD_SIZE) {
    filteredRow.push(0);
  }
  return filteredRow;
}

// Vérifier si le jeu est terminé
function checkGameOver() {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === 0) {
        return;
      }
      if (col < BOARD_SIZE - 1 && board[row][col] === board[row][col + 1]) {
        return;
      }
      if (row < BOARD_SIZE - 1 && board[row][col] === board[row + 1][col]) {
        return;
      }
    }
  }
  alert('Game Over!');
}

// Gérer les touches du clavier
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowLeft':
      move('left');
      break;
    case 'ArrowRight':
      move('right');
      break;
    case 'ArrowUp':
      move('up');
      break;
    case 'ArrowDown':
      move('down');
      break;
  }
});

// Démarrer le jeu
initGame();
