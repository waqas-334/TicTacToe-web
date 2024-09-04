const winning_combinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
];

//currentPlayer is the player symbol
function checkWin(currentPlayer) {
  for (let i = 0; i < winning_combinations.length; i++) {
    const [a, b, c] = winning_combinations[i];
    if (
      board[a] === currentPlayer &&
      board[b] === currentPlayer &&
      board[c] === currentPlayer
    ) {
      return true;
    }
  }
  return false;
}

// Initialize an empty 3x3 board
const board = [
  //first row
  null,
  null,
  null,

  //second row
  null,
  null,
  null,

  //third row
  null,
  null,
  null,
];

function resetGame() {
  for (let i = 0; i < board.length; i++) {
    board[i] = null;
  }
}

function makeMove(position, playerSymbol) {
  if (board[position] === null) {
    board[position] = playerSymbol;
  } else {
    console.log("Invalid move! Cell already occupied.");
  }
  console.log("MADE MODE: ", board);
}

// function checkWin(currentPlayer) {
//   for (let i = 0; i < winning_combinations.length; i++) {
//     const [a, b, c] = winning_combinations[i];
//     if (
//       squares[a].textContent === currentPlayer &&
//       squares[b].textContent === currentPlayer &&
//       squares[c].textContent === currentPlayer
//     ) {
//       return true;
//     }
//   }
//   return false;
// }

module.exports = { makeMove, resetGame, checkWin };
