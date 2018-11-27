const { koma } = require("../../index");

koma.$use({
  start: {
    metas: {
      mongoose: {
        load: true
      },
      graphql: {
        load: true
      },
      redis: {
        load: true
      },
      "redis-cache": {
        load: false
      }
    },
    load: {
      plugins: [],
      modules: ["./examples/advanced/modules"]
    },
    config: {
      PORT: 8001,
      RUN: true
    }
  }
});
