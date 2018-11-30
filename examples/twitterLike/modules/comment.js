const _ = require("lodash");
const { MongooseUtils, mongoose } = require("../../../plugins/mongoose");
const { models } = MongooseUtils;
const { SchemaTypes } = mongoose;
const { notify } = require("../utils");

module.exports = {
  name: "Comment",
  routes: ({ checkToken, checkComment, comment }) => ({
    "post /comment": [checkToken, checkComment, comment]
  }),
  controllers: {
    async comment(ctx) {
      const commentAuthor = _.get(ctx.state, "user.data");
      const { postId, postType, text } = ctx.request.body;

      ctx.body = await models("Comment").create({ author: commentAuthor, postId, postType, text });

      const post = await models(postType)
        .findById(postId)
        .select("author");
      notify.notification({ from: commentAuthor, to: post.author, action: "comment" });
    }
  },
  models: {
    Comment: {
      schema: {
        author: { type: SchemaTypes.ObjectId, ref: "User", required: true },
        postId: { type: SchemaTypes.ObjectId, refPath: "postType", required: true },
        postType: { type: "String", enum: ["Tweet"], required: true, default: "Tweet" },
        text: { type: "string", required: true }
      }
    }
  },
  joi: {
    checkComment: {
      body: {
        text: "string:,required",
        postId: "string:,required",
        postType: "string:,required"
      }
    }
  }
};
