const board = document.getElementById("board");
const squares = document.getElementsByClassName("square");
const inputField = document.getElementById("roomInput");
// const players = ["X", "O"];
// let currentPlayer = players[0];
const endMessage = document.createElement("h2");

endMessage.textContent = `X's turn!`;
endMessage.style.marginTop = "30px";
endMessage.style.textAlign = "center";

const roomIdElement = document.createElement("h2");
roomIdElement.style.marginTop = "30px";
roomIdElement.style.textAlign = "center";

board.after(endMessage);
board.after(roomIdElement);

var someoneWon = false;
const gameSocket = io();
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

let playerId = null;
let playerSymbol = null;

gameSocket.on("move", (payload) => {
  console.log("MOVE CALLED IN CLIENT: ", payload);
  squares[payload.position].textContent = payload.playerSymbol;
});

let room = generateRoomId();
let socketId = null;
gameSocket.on("connect", () => {
  socketId = JSON.stringify(gameSocket.id);
  console.log("Connected with socket ID:", socketId);
  joinRoom(room);
  // gameSocket.emit("joinRoom", room);
  // gameSocket.emit("getRoomSize", room);
});

// gameSocket.on("roomSize", (size) => {
//   console.log("ROOM SIZE: ", size);
// });

gameSocket.on("error", (message) => {
  showError(message);
});

gameSocket.on("roomJoined", (payload) => {
  let transferedId = JSON.stringify(payload.playerId);
  console.log("room joined = ", transferedId);
  console.log("current connection id = ", socketId);
  let isItForCurrentUser = socketId === transferedId;
  if (!isItForCurrentUser) return;

  playerSymbol = payload.symbol;
  room = payload.roomId;
  updateRoomId(payload.roomId);
  updateTitle(playerSymbol);

  // if (playerId === null) {
  //   playerId = payload.playerId;
  //   console.log("YOUR ID: ", playerId);

  // }
  // else {
  // updateTitle("Y");
  // console.log("YOU ALREADY GOT YOUR ID");
  // }
});

for (let i = 0; i < squares.length; i++) {
  squares[i].addEventListener("click", () => {
    if (squares[i].textContent !== "") {
      return;
    }
    let payload = { position: i, room: room, playerSymbol: playerSymbol };
    console.log("SENDING PAYLOAD: ", payload);

    gameSocket.emit("move", payload);

    // squares[i].textContent = currentPlayer;
    // console.log("CURRENT PLAYER: ", squares[i].id.slice(-1));
    // if (checkWin(currentPlayer)) {
    //   someoneWon = true;
    //   endMessage.textContent = `Game over! ${currentPlayer} wins!`;
    //   return;
    // }
    // if (checkTie()) {
    //   someoneWon = true;
    //   endMessage.textContent = `Game is tied!`;
    //   return;
    // }
    // currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    // if (currentPlayer == players[0]) {
    //   endMessage.textContent = `X's turn!`;
    // } else {
    //   endMessage.textContent = `O's turn!`;
    // }
  });
}

function checkWin(currentPlayer) {
  for (let i = 0; i < winning_combinations.length; i++) {
    const [a, b, c] = winning_combinations[i];
    if (
      squares[a].textContent === currentPlayer &&
      squares[b].textContent === currentPlayer &&
      squares[c].textContent === currentPlayer
    ) {
      return true;
    }
  }
  return false;
}

function checkTie() {
  for (let i = 0; i < squares.length; i++) {
    if (squares[i].textContent === "") {
      return false;
    }
  }
  return true;
}

function restartButton() {
  someoneWon = false;
  for (let i = 0; i < squares.length; i++) {
    squares[i].textContent = "";
  }
  endMessage.textContent = `X's turn!`;
  currentPlayer = players[0];
}

function generateRoomId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

// Add an event listener for the keydown event
inputField.addEventListener("keydown", function (event) {
  // Check if the pressed key is Enter (key code 13)
  if (event.key === "Enter") {
    // Prevent the default action (optional)
    event.preventDefault();
    let roomId = inputField.value;
    if (roomId.length != 4) {
      showError("NOT A VALID ROOM ID");
      return;
    }
    joinRoom(roomId);
    // Perform your desired action here
  }
});

function joinRoom(roomId) {
  gameSocket.emit("joinRoom", roomId);
}

function showError(value) {
  console.error("ERROR: ", value);
}

function updateTitle(status) {
  const titleElement = document.getElementById("title");
  if (titleElement) {
    titleElement.querySelector("h1").textContent = `Tic Tac Toe - ${status}`;
  }
}

function updateRoomId(roomId) {
  roomIdElement.textContent = roomId;
}
