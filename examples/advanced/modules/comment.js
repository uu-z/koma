const _ = require("lodash");
const { MongooseUtils, mongoose } = require("../../../plugins/mongoose");
const { models } = MongooseUtils;
const { SchemaTypes, Types } = mongoose;

module.exports = {
  name: "Comment",
  models: {
    Comment: {
      schema: {
        userId: { type: SchemaTypes.ObjectId, ref: "User", required: true },
        tweetId: { type: SchemaTypes.ObjectId, ref: "Tweet", required: true },
        text: { type: "string", required: true }
      }
    }
  }
};
