const _ = require("lodash");
const { MongooseUtils, mongoose } = require("../../../plugins/mongoose");
const { findById, pagination, updateById, done, models } = MongooseUtils;

module.exports = {
  name: "User",
  routes: ({ checkMe }) => ({
    "get /users": done(pagination("User")),
    "get /users/:id": done(findById("User")),
    "put /users/:id": [checkMe, done(updateById("User"))]
  }),
  controllers: {},
  models: {
    User: {
      schema: {
        nickname: { type: "string" },
        username: { type: "string", required: true, unique: true },
        email: { type: "string", required: true, unique: true },
        password: { type: "string", select: false, required: true, bcrypt: true, hidden: true }
      }
    }
  }
};
