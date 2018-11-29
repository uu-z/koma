const _ = require("lodash");
const { MongooseUtils, mongoose } = require("../../../plugins/mongoose");
const { redis } = require("../../../plugins/redis");

const { findById, findMany, findOne, pagination, createOne, updateById, deleteById, done, models } = MongooseUtils;
const { ActivityFeedUtils } = require("./activityFeed");
const { SchemaTypes, Types } = mongoose;
const { checkFields } = require("../utils");

module.exports = {
  name: "Tweet",
  routes: ({ checkMe, createTweet }) => ({
    "get /tweet": done(pagination("Tweet")),
    "get /tweet/many": done(findMany("Tweet")),
    "get /tweet/one": done(findOne("Tweet")),
    "get /tweet/:id": done(findById("Tweet")),
    "post /tweet/": [checkMe, createTweet],
    "put /tweet/:id": done(updateById("Tweet")),
    "delete /tweet/:id": done(deleteById("Tweet"))
  }),
  controllers: {
    async createTweet(ctx) {
      const [Tweet] = [models("Follow")];
      const userId = _.get(ctx.state, "user.data");

      const tweet = await Tweet.create({ ...ctx.request.body, user: userId });
      ctx.body = tweet;

      ActivityFeedUtils.create({
        actor: userId,
        actorType: "User",
        object: tweet._id,
        objectType: "Tweet"
      });
    },
    checkMe: checkFields("state.user.data", 401, "Authorization Error")
  },
  models: {
    Tweet: {
      schema: {
        tweet: { type: "string", required: true },
        user: { type: SchemaTypes.ObjectId, ref: "User", required: true, autopopulate: true }
      }
    }
  }
};
