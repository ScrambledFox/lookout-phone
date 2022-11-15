const path = require("path");
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const Player = require("./Player");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.port || 3222;

app.use(express.static(path.resolve(__dirname, "../client/build")));

let _connectedPlayers = [];

app.get("/status", (req, res) => {
  res.json({ status: 200 });
});

/// Test start GET
app.get("/start", (req, res) => {
  io.emit("gameStarted", { message: "The game has started." });
});

io.on("connection", (socket) => {
  console.log(`A new user connected to socket.`);

  /// General ping request.
  socket.on("ping", () => {
    socket.emit("pong");
  });

  /// Request for player to join a lobby.
  socket.on("joinLobby", (username, callback) => {
    if (_connectedPlayers.some((p) => p.username === username)) {
      console.log(
        `${username} tried to join the lobby, but someone with the same name has already connected.`
      );

      callback({
        status: -1,
        message: `User with username ${username} already connected.`,
      });
      return;
    }

    // Create new user
    let newUser = new Player(username);
    _connectedPlayers.push(newUser);

    console.log(`${newUser.username} has joined the lobby.`);

    // Broadcast playerJoined event.
    io.emit("playerJoinedLobby", {
      message: `${username} has joined the lobby.`,
      user: newUser,
      players: _connectedPlayers,
    });

    // Return succesfull connect callback.
    callback({
      status: 0,
      message: "Successfully joined the lobby.",
      user: newUser,
      players: _connectedPlayers,
    });
  });

  /// Request from a player to get a new avatar and theme colour.
  socket.on("requestNewAvatar", (username, callback) => {
    let player = _connectedPlayers.find((p) => p.username === username);

    if (player === undefined) {
      callback({
        status: -1,
        message: `Player with username ${username} not found.`,
      });
      return;
    }

    player.rerollAvatarSeed();
    player.rerollColour();

    callback({ status: 0, message: "New avatar created.", user: player });
  });

  /// Request from VR to start the game.
  socket.on("startGame", (callback) => {
    io.emit("gameStarted", { message: "The game has started." });
    callback({ status: 0, message: "Game successfully started." });
  });

  /// Socket disconnect event.
  socket.on("disconnect", () => {
    console.log("A socket connection closed.");
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

server.listen(PORT, () => {
  console.log(`LookOut Broker listening on port ${PORT}`);
});
