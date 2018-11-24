const { koma, utils } = require("../../index");
const config = require("./config");

koma
  .$use({
    metas: {
      mongoose: {
        load: true
      },
      redis: {
        load: true
      }
    }
  })
  .$use({
    load: {
      modules: ["./examples/advanced/modules"]
    },
    start: { config }
  });
