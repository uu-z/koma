const Mhr = require("menhera").default;
const IO_Client = require("socket.io-client");

let client;

module.exports = {
  name: "SocketClient",
  $start: {
    socketServer() {
      client = IO_Client(`http://${Mhr.config.HOST}:${Mhr.config.PORT}`);
      client.on("connect", () => {
        console.info("socket-client:", "connected");
      });
    }
  }
};
