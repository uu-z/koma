const { koma, config } = require("../../index");
const path = require("path");

koma.$use({
  start: {
    metas: {
      mongoose: { load: true },
      "graphql-compose": { load: true },
      redis: { load: true },
      elasticsearch: { load: true },
      kue: { load: true },
      jwt: { load: true }
    },
    load: {
      plugins: [],
      modules: ["helpers", "modules"].map(i => path.join(__dirname, i))
    },
    config: {
      PORT: 8001,
      KUE_PORT: 8002,
      RUN: true
    }
  }
});
