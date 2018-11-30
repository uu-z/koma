const path = require("path");

const {
  NODE_ENV = "prod",
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

const config = {
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
  JWT_EXP,
  CORS: { origin: "*" },
  graphql: {
    genSchemaFromMongoose: true
  },
  KUE_PORT: 8002,
  REDIS_CACHE: {
    redis: {
      host: REDIS_HOST,
      port: REDIS_PORT
    },
    onerror(err) {
      console.log(err);
    }
  },
  BODY_PARSER: {},
  HELMET: {},
  JWT: { secret: JWT_SECRET, passthrough: true }
};

const settings = {
  prod: {
    start: {
      metas: {
        middlewares: { load: true },
        joi: { load: true },
        event: { load: true },
        upload: { load: false },
        jwt: { load: false },
        logger: { load: false },
        kue: { load: false },
        schedule: { load: false },
        graphql: { load: false, depends_on: ["mongoose"] },
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
        ...config
      },
      load: {
        plugins: [path.resolve(__dirname, "./plugins")],
        modules: []
      }
    }
  },
  dev: {
    start: {
      metas: {
        graphql: { depends_on: ["mongoose"] }
      },
      config: {
        ...config
      },
      load: {
        plugins: [path.resolve(__dirname, "./plugins")],
        modules: []
      }
    }
  }
};
const setting = settings[NODE_ENV];

exports.config = config;
exports.settings = settings;
exports.setting = setting;
