const Mhr = require("./hooks");

const {
  PORT = 8001,
  ES_ENABLE = false,
  REDIS_ENABLE = false,
  MONGO_ENABLE = true,
  REDIS_HOST = "localhost",
  REDIS_PORT = "6379",
  MONGO_URL = "localhost:27017",
  MONGO_DATABASE = "test"
} = process.env;

Mhr.$use({
  config: {
    PORT,
    ES_ENABLE,
    REDIS_ENABLE,
    REDIS_HOST,
    REDIS_PORT,
    MONGO_ENABLE,
    MONGO_URL,
    MONGO_DATABASE
  }
});
