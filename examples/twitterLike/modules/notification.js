const _ = require("lodash");
const { MongooseUtils, mongoose } = require("../../../plugins/mongoose");
const { pagination, models } = MongooseUtils;
const { SchemaTypes } = mongoose;

module.exports = {
  name: "Notification",
  routes: ({}) => ({
    "get /notification/:username": "NotificationList"
  }),
  methods: {
    async NotificationList(ctx) {
      const { username } = ctx.params;
      const user = await models("User")
        .findOne({ username })
        .select("_id");

      ctx.body = await pagination("Notification", { query: { to: user._id }, populate: "from" })(ctx);
    }
  },
  models: {
    Notification: {
      schema: {
        from: { type: SchemaTypes.ObjectId, ref: "User", required: true },
        to: { type: SchemaTypes.ObjectId, ref: "User", required: true },
        status: { type: "string", enum: ["unread", "read"], required: true, default: "unread" },
        action: { type: "string", required: true }
      },
      options: {
        timestamp: true
      }
    }
  },
  event: {
    on: {
      async notification({ from, to, action }) {
        const Notification = models("Notification");
        await Notification.create({
          from,
          to,
          action
        });
      }
    }
  }
};
