const _ = require("lodash");
const { MongooseUtils } = require("../../../plugins/mongoose");
const { findById, pagination, updateById, done } = MongooseUtils;

module.exports = {
  name: "User",
  routes: () => ({
    "get /users": done(pagination("User")),
    "get /users/:id": done(findById("User")),
    "put /users/:id": ["checkToken", done(updateById("User"))]
  }),
  controllers: {},
  models: {
    User: {
      schema: {
        nickname: { type: "string" },
        username: { type: "string", required: true, unique: true },
        email: { type: "string", required: true, unique: true },
        password: { type: "string", select: false, required: true, bcrypt: true, hidden: true }
      },
      options: {
        timestamp: true
      }
    }
  }
};
