const _ = require("lodash");
const { MongooseUtils, mongoose } = require("../../../plugins/mongoose");
const {
  findById,
  findMany,
  findOne,
  pagination,
  createOne,
  createMany,
  updateById,
  updateMany,
  updateOne,
  deleteById,
  deleteMany,
  deleteOne,
  count,
  done
} = MongooseUtils;

module.exports = {
  name: "Tweet",
  routes: ({ checkToken }) => ({
    "get /tweet": done(pagination("Tweet")),
    "get /tweet/many": done(findMany("Tweet")),
    "get /tweet/one": done(findOne("Tweet")),
    "get /tweet/count": done(count("Tweet")),
    "get /tweet/:id": done(findById("Tweet")),
    "post /tweet/many": done(createMany("Tweet")),
    "post /tweet/one": [checkToken, done(createOne("Tweet"))],
    "put /tweet/many": done(updateMany("Tweet")),
    "put /tweet/one": done(updateOne("Tweet")),
    "put /tweet/:id": done(updateById("Tweet")),
    "delete /tweet/many": done(deleteMany("Tweet")),
    "delete /tweet/one": done(deleteOne("Tweet")),
    "delete /tweet/:id": done(deleteById("Tweet"))
  }),
  controllers: {},
  models: {
    Tweet: {
      schema: {
        text: {
          type: "string",
          required: true
        },
        userId: {
          type: "ObjectId",
          ref: "User",
          required: true,
          autopopulate: true
        }
      }
    }
  }
};
