const { koma } = require("../../index");
const path = require("path");

koma.$use({
  start: {
    metas: {
      mongoose: { load: true },
      "graphql-compose": { load: true },
      jwt: { load: true }
    },
    load: {
      plugins: [],
      modules: ["modules"].map(i => path.join(__dirname, i))
    },
    config: {
      PORT: 8001,
      RUN: true
    }
  }
});
