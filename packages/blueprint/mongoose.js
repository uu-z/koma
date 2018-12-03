const Mhr = require("menhera").default;

module.exports = (t, k, d) => {
  Mhr.$use({
    models: {
      [k]: {
        schemas: d
      }
    }
  });
};
