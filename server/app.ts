import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { ChatMessage } from "../components/Chat";

// socket server set up
const socketPort = 8080;
const socketApp = express();
const socketServer = http.createServer(socketApp);

const options = {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
};
const io = new Server(socketServer, options);

io.on("connection", (socket) => {
  //user socket events goes here
  console.log("some dude joined");
  socket.on("user-connected", (roomId, id) => {
    console.log(roomId, id);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", { id });
    socket.on("user-sent-message", (message: ChatMessage) => {
      message.isLocal = false;
      socket.broadcast.to(roomId).emit("user-sent-message", message);
    });
    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", id);
    });
  });
});

socketServer.listen(socketPort, () => {
  console.log(`socket server is live on ${socketPort}`);
});
