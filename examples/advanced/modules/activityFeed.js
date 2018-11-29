const _ = require("lodash");
const { MongooseUtils, mongoose } = require("../../../plugins/mongoose");
const { pagination, models } = MongooseUtils;
const { SchemaTypes, Types } = mongoose;

module.exports = {
  name: "ActivityFeed",
  routes: () => ({
    "get /feed/:userId": "feedList"
  }),
  models: {
    Feed: {
      schema: {
        userId: { type: SchemaTypes.ObjectId, ref: "User", required: true },
        activityId: { type: SchemaTypes.ObjectId, ref: "Activity", required: true }
      }
    },
    Activity: {
      schema: {
        actor: { type: SchemaTypes.ObjectId, refPath: "actorType", required: true },
        actorType: { type: "string", enum: ["User"], required: true, default: "User" },
        object: { type: SchemaTypes.ObjectId, refPath: "objectType", required: true },
        objectType: { type: "string", enum: ["Tweet"], required: true, default: "Tweet" },
        action: { type: "string", required: true },
        status: { type: "string", enum: ["init", "valid", "invalid"] }
      }
    }
  },
  controllers: {
    async feedList(ctx) {
      const { userId } = ctx.params;
      ctx.body = await pagination("Feed", {
        query: { userId },
        populate: [{ path: "activityId", populate: [{ path: "actor" }, { path: "object" }] }]
      })(ctx);
    }
  },
  ActivityFeedUtils: {
    async create({ actor, actorType, object, objectType, action }) {
      const Activity = models("Activity");
      return await Activity.create({
        actor,
        actorType,
        object,
        objectType,
        action,
        status: "init"
      });
    }
  }
};
