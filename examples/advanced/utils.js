const _ = require("lodash");
const { event } = require("../../plugins/event");

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
  notify: new Notify()
};
