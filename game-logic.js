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
function checkWin(roomId, currentPlayer) {
  let currentRoomBoard = board[roomId];
  console.log("CURRENT ROOM: ", currentRoomBoard);
  for (let i = 0; i < winning_combinations.length; i++) {
    const [a, b, c] = winning_combinations[i];
    if (
      currentRoomBoard[a] === currentPlayer &&
      currentRoomBoard[b] === currentPlayer &&
      currentRoomBoard[c] === currentPlayer
    ) {
      return true;
    }
  }
  return false;
}

// Initialize an empty 3x3 board
const board = {
  //roomId: array of board symbols
};
let moveCounter = {
  //roomId: counterValue
};
let winner = {
  //roomId : true/false
};

function initGame(roomId) {
  board[roomId] = [null, null, null, null, null, null, null, null, null];
  moveCounter[roomId] = 0;
  winner[roomId] = false;
}

function resetGame(roomId) {
  initGame(roomId);
}

function makeMove(roomId, position, playerSymbol) {
  if (winner[roomId])
    return {
      isError: true,
      message: "Please restart game",
    };

  let move = moveCounter[roomId];

  if (move === 8) return { isError: false, message: "Tie" };

  let isXsTurn = move % 2 == 0;

  let errorMessage = { isError: true, message: "Not your turn" };

  if (isXsTurn && playerSymbol === "Y") {
    return errorMessage;
  }

  if (!isXsTurn && playerSymbol === "X") {
    return errorMessage;
  }

  if (board[roomId][position] != null) {
    let message = "Invalid move! Cell already occupied.";
    console.log(message);
    return { isError: true, message: message };
  }

  board[roomId][position] = playerSymbol;
  if (checkWin(roomId, playerSymbol)) {
    winner[roomId] = true;
    return { isError: false, message: playerSymbol + " WON " };
  }
  console.log("MADE MODE: ", board[roomId]);

  moveCounter[roomId] = move + 1;
  let normalMessage = "X's turn!";
  if (isXsTurn) normalMessage = "Y's turn! ";
  return {
    isError: false,
    message: normalMessage,
  };
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

module.exports = { makeMove, resetGame, checkWin, initGame };
