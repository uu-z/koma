const { koma } = require("../../index");
const path = require("path");

koma.$use({
  start: {
    metas: {
      mongoose: { load: true },
      graphql: { load: true, depends_on: ["mongoose"] },
      redis: { load: true },
      "redis-cache": { load: true },
      kue: { load: true }
    },
    load: {
      plugins: [],
      modules: [path.join(__dirname, "./modules")]
    },
    config: {
      PORT: 8001,
      KUE_PORT: 8002,
      RUN: true
    }
  }
});
