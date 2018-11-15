const es = require("koa-elasticsearch");

module.exports = {
  name: "ElasticeSearch",
  $config({ _val }) {
    const { ES_ENABLE } = _val;
    if (!ES_ENABLE) return;
    console.log("elasticesearch start~");
    Mhr.$use({
      use: [es]
    });
  }
};
