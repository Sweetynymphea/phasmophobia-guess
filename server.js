const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const tmi = require("tmi.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const votes = {};

const client = new tmi.Client({
  identity: {
    username: process.env.BOT_NAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [process.env.CHANNEL]
});

client.connect();

client.on("message", (channel, tags, message) => {
  if (!message.startsWith("!guess ")) return;

  const ghost = message.replace("!guess ", "").trim().toLowerCase();

  votes[tags.username] = ghost;

  io.emit("votes", votes);
});

app.use(express.static("public"));

server.listen(process.env.PORT || 3000);
