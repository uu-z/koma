const _ = require("lodash");
const Mhr = require("menhera").default;
const { MongooseUtils } = require("../../../plugins/mongoose");
const { models } = MongooseUtils;
const { signJWT } = require("../../../plugins/jwt");

module.exports = {
  name: "User",
  gql: {
    resolvers: {
      Mutation: {
        Login: {
          type: `type Login {account: Account!, jwt: String!}`,
          args: { identifier: "String!", password: "String!" },
          hide: true,
          resolve: async ({ args }) => {
            const { identifier, password } = args;
            const account = await models("Account")
              .findOne({ $or: [{ username: identifier }] })
              .select("+password");
            if (!account) throw new Error("No user founded");
            const validPassword = await account.verifyPassword(password);
            if (validPassword) {
              delete account.password;
              return { account, jwt: signJWT({ _id: account._id, role: account.role }) };
            } else {
              throw new Error("Invalid password or username");
            }
          }
        },
        SignUp: {
          type: `type User {username: String!}`,
          args: {
            username: "String!",
            password: "String!"
          },
          resolve: async ({ args }) => {
            const user = await models("Account").create(args);
            return user;
          }
        }
      }
    }
  },
  models: {
    Account: {
      schema: {
        username: { type: "string", required: true, unique: true },
        password: { type: "string", select: false, required: true, bcrypt: true, hidden: true }
      },
      options: {
        timestamp: true
      }
    }
  }
};
