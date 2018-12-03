module.exports = {
  name: "Test",
  routes: {
    "get /hello": "hello"
  },
  methods: {
    async hello(ctx) {
      ctx.body = "Hello World";
    }
  }
};
