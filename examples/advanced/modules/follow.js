const _ = require("lodash");
const { MongooseUtils, mongoose } = require("../../../plugins/mongoose");
const { pagination, models } = MongooseUtils;
const { SchemaTypes, Types } = mongoose;

const { ActivityFeedUtils } = require("./activityFeed");

module.exports = {
  name: "Follow",
  routes: ({ follow, checkMe, checkFollow, unfollow }) => ({
    "get /following/:userId": "followingList",
    "get /follower/:userId": "followerList",
    "post /follow": [checkMe, checkFollow, follow],
    "post /unfollow": [checkMe, checkFollow, unfollow]
  }),
  controllers: {
    async followerList(ctx) {
      const { userId } = ctx.params;
      ctx.body = await pagination("Follow", { query: { followId: userId }, populate: "userId" })(ctx);
    },
    async followingList(ctx) {
      const { userId } = ctx.params;
      ctx.body = await pagination("Follow", { query: { userId }, populate: "followId" })(ctx);
    },
    async follow(ctx) {
      const Follow = models("Follow");
      const userId = _.get(ctx, "state.user.data");
      const { followId } = ctx.request.body;
      const exists = Follow.findOne({ userId, followId });
      if (exists) {
        ctx.throw(400, "The user has alread followed ");
      } else {
        let follow = await Follow.create({ userId, followId });
        ctx.body = follow;
        ActivityFeedUtils.create({
          actor: userId,
          actorType: "User",
          object: follow._id,
          objectType: "Follow",
          action: "follow"
        });
      }
    },
    async unfollow(ctx) {
      const Follow = models("Follow");
      const userId = _.get(ctx, "state.user.data");
      const { followId } = ctx.request.body;

      ctx.body = await Follow.deleteOne({ userId, followId });
    }
  },
  models: {
    Follow: {
      schema: {
        userId: { type: SchemaTypes.ObjectId, ref: "User" },
        followId: { type: SchemaTypes.ObjectId, ref: "User" }
      }
    }
  },
  joi: {
    checkFollow: {
      body: {
        followId: "string:,required"
      }
    }
  }
};
