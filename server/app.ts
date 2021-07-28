import express from "express";

const app = express();
console.log(process.env.SOCKET_PORT);

app.listen(8080, () => {
  console.log("we are live");
});
