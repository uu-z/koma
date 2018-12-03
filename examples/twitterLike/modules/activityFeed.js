const _ = require("lodash");
const { MongooseUtils, mongoose } = require("../../../plugins/mongoose");
const { pagination, models } = MongooseUtils;
const { SchemaTypes } = mongoose;
const { queue } = require("../../../plugins/kue");

queue.process("activity", 1, async (job, done) => {
  const { _id, actor, actorType } = job.data.activity;
  if (actorType == "User") {
    const [Follow, Feed] = models(["Follow", "Feed"]);
    const followers = await Follow.find({ followId: actor }).select("-_id userId");
    const feeds = followers.map(({ userId }) => ({
      userId,
      activityId: _id
    }));
    await Feed.insertMany(feeds);
    done();
  }
});

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
        objectType: { type: "string", enum: ["Tweet", "Follow", "User"], required: true, default: "Tweet" },
        action: { type: "string", required: true },
        status: { type: "string", enum: ["init", "process", "valid", "invalid"], required: true, default: "init" }
      }
    }
  },
  methods: {
    async feedList(ctx) {
      const { userId } = ctx.params;
      ctx.body = await pagination("Feed", {
        query: { userId },
        populate: [{ path: "activityId", populate: [{ path: "actor" }, { path: "object" }] }]
      })(ctx);
    }
  },
  event: {
    on: {
      async activity({ actor, actorType, object, objectType, action }) {
        const activity = await models("Activity").create({ actor, actorType, object, objectType, action });
        queue
          .create("activity", {
            title: `${actorType}:${actor} ${action} ${objectType}:${object}`,
            activity: activity.toJSON()
          })
          // .removeOnComplete(true)
          .events(false)
          .save();
      }
    }
  }
};
