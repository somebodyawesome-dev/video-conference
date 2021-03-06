import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { ChatMessage } from "../components/Chat";
import { ExpressPeerServer } from "peer";
// import siofu from "socketio-file-upload";
const siofu = require("socketio-file-upload");
// socket server set up
const socketPort = 8080;
const socketApp = express();
socketApp.use(siofu);
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
  const uploader: any = new siofu();
  uploader.dir = "./uploads";
  uploader.listen(socket);
  console.log(uploader);

  //user socket events goes here
  console.log("some dude joined");
  socket.on("user-connected", (roomId, id, user, audio, video) => {
    console.log(roomId, id, user);
    socket.join(roomId);
    //TODO implement sending the stat of stream
    socket.broadcast
      .to(roomId)
      .emit("user-connected", { id, user, audio, video });
    socket.on("user-sent-message", (message: ChatMessage) => {
      message.isLocal = false;
      socket.broadcast.to(roomId).emit("user-sent-message", message);
    });
    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", id);
    });
    socket.on("user-toggle-video", (camera: boolean) => {
      socket.broadcast.to(roomId).emit("user-toggle-video", id, camera);
    });
    socket.on("user-toggle-audio", (audio: boolean) => {
      socket.broadcast.to(roomId).emit("user-toggle-audio", id, audio);
    });
  });
});

socketServer.listen(socketPort, () => {
  console.log(`socket server is live on ${socketPort}`);
});

// const peerApp = express();
// const server = http.createServer(peerApp);
// const peerServer = ExpressPeerServer(server, {
//   path: "/peerjs",
//   port: 9000,
// });
// peerApp.use("/peerjs", peerServer);

// peerServer.listen(() => {
//   console.log(`we are live on 9000`);
// });
