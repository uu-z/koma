const EventEmitter = require("events");

const event = new EventEmitter();
module.exports = {
  name: "Event",
  event,
  $event: {
    on: {
      $({ _key, _val }) {
        event.on(_key, _val);
      }
    }
  }
};
