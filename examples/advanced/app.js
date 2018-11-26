const { koma } = require("../../index");
const config = require("./config");

koma
  .$use({
    metas: {
      mongoose: {
        load: true
      },
      redis: {
        load: true
      },
      hook: {
        load: config.IS_PROD ? false : true
      }
    }
  })
  .$use({
    load: {
      modules: ["./examples/advanced/modules"]
    },
    start: { config }
  });
