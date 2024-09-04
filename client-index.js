const socket = io(); // This will connect to the same host that serves the page

// Example usage:
socket.on("connect", () => {
  updateTitle("Connected");
});

socket.on("disconnect", () => {
  updateTitle("Disconnected");
});

// Listening for an event
socket.on("my response", (data) => {
  console.log(data);
});

// Function to update the title text
function updateTitle(status) {
  const titleElement = document.getElementById("title");
  if (titleElement) {
    titleElement.querySelector("h1").textContent = `Tic Tac Toe - ${status}`;
  }
}
