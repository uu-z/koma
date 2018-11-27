const Mhr = require("menhera").default;
const mongoose = require("mongoose");
const { composeWithMongoose } = require("graphql-compose-mongoose/node8");
const { schemaComposer } = require("graphql-compose");
const _ = require("lodash");
const graphqlHTTP = require("koa-graphql");
const koaPlayground = require("graphql-playground-middleware-koa").default;

const defaultResolvers = {
  Query: ["findById", "findByIds", "findOne", "findMany", "count", "connection", "pagination"],
  Mutation: [
    "createOne",
    "createMany",
    "updateById",
    "updateOne",
    "updateMany",
    "removeById",
    "removeOne",
    "removeMany"
  ]
};

module.exports = {
  name: "Graphql",
  $start: {
    app() {
      console.success("graphql start~~~");
    },
    router() {
      _.each(mongoose.models, (val, key) => {
        let options = {
          fields: {
            remove: []
          }
        };
        const schemaObj = _.get(val, "schema.obj", {});
        _.each(schemaObj, (val, key) => {
          if (val.hidden) {
            options.fields.remove.push(key);
          }
        });

        const schema = composeWithMongoose(val, options);
        _.each(defaultResolvers, (v1, k1) => {
          v1.map(v2 => {
            schemaComposer[k1].addFields({
              [`${key}${v2}`]: schema.getResolver(v2)
            });
          });
        });
      });
      const graphqlSchema = schemaComposer.buildSchema();
      Mhr.$use({
        routes: {
          "all /graphql": graphqlHTTP({ schema: graphqlSchema }),
          "all /playground": koaPlayground({ endpoint: "/graphql" })
        }
      });
    }
  }
};
