const Mhr = require("menhera").default;

module.exports = {
  load: false,
  method() {
    return (t, k, d) => {
      Mhr.$use({
        methods: {
          [k]: d.value
        }
      });
    };
  }
};
