const path = require("path");

module.exports = {
  start: {
    metas: {
      middlewares: {
        load: true
      },
      validators: {
        load: true
      },
      schedule: {
        load: false
      },
      graphql: {
        load: false
      },
      mongoose: {
        load: false
      },
      redis: {
        load: false
      },
      "redis-cache": {
        load: false
      },
      elasticsearch: {
        load: false
      },
      passport: {
        load: false
      },
      socket: {
        load: false
      },
      "socket-client": {
        load: false
      },
      cli: {
        load: false
      }
    },
    config: {},
    load: {
      plugins: [path.resolve(__dirname, "./plugins")]
    }
  }
};
