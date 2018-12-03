const Mhr = require("menhera").default;

module.exports = {
  currentRouteName: "",
  fns: [],
  init() {
    this.currentRouteName = "";
    this.fns = [];
  },
  route(name) {
    this.currentRouteName = name;
    return this;
  },
  check(...fns) {
    this.fns = [...this.fns, ...fns];

    return this;
  },
  parse() {
    return (t, k, d) => {
      Mhr.$use({ routes: { [this.currentRouteName]: [...this.fns, d.value] } });
    };
  }
};
