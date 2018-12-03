import { MongooseUtils } from "../../../../plugins/mongoose";
const { models } = MongooseUtils;
import bp from "../../../../plugins/blueprint";

export default class Index1 {
  routes = {
    "get /": "testFindOne",
    "post /": "testCreateOne"
  };

  @bp.method()
  async testFindOne(ctx: any) {
    ctx.body = await models("Test").findOne(ctx.query);
  }

  @bp.method()
  async testCreateOne(ctx: any) {
    ctx.body = await models("Test").create(ctx.request.body);
  }

  models = {
    Test: {
      schema: {
        text: { type: "string" }
      }
    }
  };
}
