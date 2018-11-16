module.exports = {
  HOST: process.env.HOST || "localhost",
  PORT: process.env.PORT || 8001,
  ES_ENABLE: process.env.ES_ENABLE || false,
  REDIS_ENABLE: process.env.REDIS_ENABLE || true,
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: process.env.REDIS_PORT || "6379",
  MONGO_ENABLE: process.env.MONGO_ENABLE || true,
  MONGO_URL: process.env.MONGO_URL || "localhost:27017",
  MONGO_DATABASE: process.env.MONGO_URL || "test",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_EXP: process.env.JWT_EXP || Math.floor(Date.now() / 1000) + 60 * 60 * 12,
  SOCKET_IO_ENABLE: process.env.SOCKET_IO_ENABLE || true,
  SOCkET_IO_CLIENT_ENABLE: process.env.SOCkET_IO_CLIENT_ENABLE || true
};
