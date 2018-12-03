const _ = require("lodash");
const { MongooseUtils, mongoose } = require("../../../plugins/mongoose");
const { findById, pagination, done, models } = MongooseUtils;
const { SchemaTypes } = mongoose;
const { notify } = require("../utils");

module.exports = {
  name: "Tweet",
  routes: () => ({
    "get /tweet": done(pagination("Tweet")),
    "get /tweet/:id": done(findById("Tweet")),
    "post /tweet/": ["checkToken", "createTweet"]
  }),
  methods: {
    async createTweet(ctx) {
      const userId = _.get(ctx.state, "user.data");
      const tweet = await models("Tweet").create({ ...ctx.request.body, author: userId });
      ctx.body = tweet;

      notify.activity({
        actor: userId,
        actorType: "User",
        object: tweet._id,
        objectType: "Tweet",
        action: "create"
      });
    }
  },
  models: {
    Tweet: {
      schema: {
        author: { type: SchemaTypes.ObjectId, ref: "User", required: true, autopopulate: true },
        tweet: { type: "string", required: true }
      },
      options: {
        timestamp: true
      }
    }
  }
};
