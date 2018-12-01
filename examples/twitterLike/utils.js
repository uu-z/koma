const _ = require("lodash");
const { event } = require("../../plugins/event");
const { MongooseUtils } = require("../../plugins/mongoose");
const { models } = MongooseUtils;

class Notify {
  activity({ actor, actorType, object, objectType, action }) {
    event.emit("activity", { actor, actorType, object, objectType, action });
    return this;
  }
  notification({ from, to, action }) {
    event.emit("notification", { from, to, action });
    return this;
  }
}

module.exports = {
  checkFields: (key, code, errMessage) => async (ctx, next) => {
    const val = _.get(ctx, key);
    if (val) {
      await next();
    } else {
      ctx.throw(401, errMessage || "field is incorrect");
    }
  },
  notify: new Notify(),
  syncMongo_ES({ model }) {
    const Model = models(model);
    const stream = Model.synchronize();
    let count = 0;
    stream.on("data", function(err, doc) {
      count++;
    });
    stream.on("close", function() {
      console.log(`indexed ${count} documents!`);
    });
    stream.on("error", function(err) {
      console.log(err);
    });
  }
};
