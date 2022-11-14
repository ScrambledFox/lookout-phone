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

io.on("connection", (socket) => {
  console.log(`A new user connected to socket.`);

  socket.on("ping", () => {
    socket.emit("pong");
  });

  socket.on("joinLobby", (username, callback) => {
    if (_connectedPlayers.some((p) => p.username === username)) {
      callback({
        state: -1,
        message: `User with username ${username} already connected.`,
      });
      return;
    }
    let newUser = new Player(username);
    _connectedPlayers.push(newUser);
    callback({
      status: 0,
      message: "Succesfully joined the lobby.",
      user: newUser,
      players: _connectedPlayers,
    });
  });

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
