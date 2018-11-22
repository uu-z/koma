const { koma, utils } = require("../../index");
const config = require("./config");

koma
  .$use({
    metas: {
      mongoose: {
        load: true
      }
    }
  })
  .$use({
    load: {
      modules: ["./examples/simple/modules"]
    },
    start: { config }
  });
