const es = require("koa-elasticsearch");

module.exports = {
  name: "ElasticeSearch",
  $start: {
    config({ _val }) {
      const { ES_PORT, ES_HOST } = _val;
      console.success("elasticesearch start~");
      Mhr.$use({
        use: [
          es({
            host: {
              host: ES_HOST,
              port: ES_PORT
            }
          })
        ]
      });
    }
  }
};
