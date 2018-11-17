const pkg = require("./package.json");

const {
  HOST = "localhost",
  PORT = 8001,
  ES_ENABLE = false,
  REDIS_CACHE_ENABLE = true,
  REDIS_HOST = "localhost",
  REDIS_PORT = "6379",
  MONGO_ENABLE = true,
  MONGO_URL = "localhost:27017",
  MONGO_DATABASE = "test",
  JWT_SECRET = "secred",
  JWT_EXP = Math.floor(Date.now() / 1000) + 60 * 60 * 12,
  SOCKET_IO_ENABLE = true,
  SOCKET_IO_CLIENT_ENABLE = false,
  CLI_ENABLE = true
} = process.env;

module.exports = {
  ...pkg,
  HOST,
  PORT,
  ES_ENABLE,
  REDIS_CACHE_ENABLE,
  REDIS_HOST,
  REDIS_PORT,
  MONGO_ENABLE,
  MONGO_URL,
  MONGO_DATABASE,
  JWT_SECRET,
  JWT_EXP,
  SOCKET_IO_ENABLE,
  SOCKET_IO_CLIENT_ENABLE,
  CLI_ENABLE
};
