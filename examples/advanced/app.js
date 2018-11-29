const { koma } = require("../../index");

koma.$use({
  start: {
    metas: {
      mongoose: { load: true },
      graphql: { load: true, depends_on: ["mongoose"] },
      redis: { load: true },
      kue: { load: true }
    },
    load: {
      plugins: [],
      modules: ["./examples/advanced/modules"]
    },
    config: {
      PORT: 8001,
      KUE_PORT: 8002,
      RUN: true
    }
  }
});
