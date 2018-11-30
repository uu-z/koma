const _ = require("lodash");
const { MongooseUtils, mongoose } = require("../../../plugins/mongoose");
const { pagination, models } = MongooseUtils;
const { SchemaTypes } = mongoose;
const { notify } = require("../utils");

module.exports = {
  name: "Follow",
  routes: ({ follow, checkToken, checkFollow, unfollow }) => ({
    "get /following/:username": "followingList",
    "get /follower/:username": "followerList",
    "post /follow": [checkToken, checkFollow, follow],
    "post /unfollow": [checkToken, checkFollow, unfollow]
  }),
  controllers: {
    async followerList(ctx) {
      const { username } = ctx.params;
      const user = await models("User")
        .findOne({ username })
        .select("_id");
      ctx.body = await pagination("Follow", { query: { followId: user._id }, populate: "userId" })(ctx);
    },
    async followingList(ctx) {
      const { username } = ctx.params;
      const user = await models("User")
        .findOne({ username })
        .select("_id");
      ctx.body = await pagination("Follow", { query: { userId: user._id }, populate: "followId" })(ctx);
    },
    async follow(ctx) {
      const userId = _.get(ctx, "state.user.data");
      const { followId } = ctx.request.body;
      const Follow = models("Follow");
      const exists = await Follow.findOne({ userId, followId });

      if (exists) {
        ctx.throw(400, "The user has alread followed ");
      } else {
        let follow = await Follow.create({ userId, followId });
        ctx.body = follow;

        notify
          .activity({
            actor: userId,
            actorType: "User",
            object: followId,
            objectType: "User",
            action: "follow"
          })
          .notification({
            from: userId,
            to: followId,
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
