import { MongooseUtils } from "../../../../plugins/mongoose";
const { models } = MongooseUtils;

export default class Index1 {
  routes = {
    "get /": "testFindOne",
    "post /": "testCreateOne"
  };
  controllers = {
    async testFindOne(ctx: any) {
      ctx.body = await models("Test").findOne(ctx.query);
    },
    async testCreateOne(ctx: any) {
      ctx.body = await models("Test").create(ctx.request.body);
    }
  };
  models = { Test: { schema: { text: { type: "string" } } } };
}
