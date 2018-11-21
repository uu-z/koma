const config = require("../config");
const IO_Client = require("socket.io-client");

let client;

module.exports = {
  name: "SocketClient",
  $start: {
    socketServer() {
      client = IO_Client(`http://${config.HOST}:${config.PORT}`);
      client.on("connect", () => {
        console.info("client:", "connected");
      });
    }
  }
};
