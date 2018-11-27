const path = require("path");

const {
  NODE_ENV = "dev",
  HOST = "localhost",
  PORT = 8001,
  ES_HOST = "localhost",
  ES_PORT = 9200,
  REDIS_HOST = "localhost",
  REDIS_PORT = 6379,
  MONGO_URL = "localhost:27017",
  MONGO_DATABASE = "test",
  JWT_SECRET = "secred",
  JWT_EXP = Math.floor(Date.now() / 1000) + 60 * 60 * 12
} = process.env;

module.exports = {
  start: {
    metas: {
      middlewares: { load: true },
      validators: { load: true },
      schedule: { load: false },
      graphql: { load: false },
      mongoose: { load: false },
      redis: { load: false },
      "redis-cache": { load: false },
      elasticsearch: { load: false },
      passport: { load: false },
      socket: { load: false },
      "socket-client": { load: false },
      cli: { load: false }
    },
    config: {
      CORS: { origin: "*" },
      BODY_PARSER: {},
      HELMET: {},
      JWT: { secret: JWT_SECRET, passthrough: true },
      IS_PROD: NODE_ENV == "prod",
      NODE_ENV,
      HOST,
      PORT,
      ES_HOST,
      ES_PORT,
      REDIS_HOST,
      REDIS_PORT,
      MONGO_URL,
      MONGO_DATABASE,
      JWT_SECRET,
      JWT_EXP
    },
    load: {
      plugins: [path.resolve(__dirname, "./plugins")],
      modules: []
    }
  }
};
