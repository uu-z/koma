const Mhr = require("menhera").default;
const signale = require("signale");

const {
  complete,
  error,
  debug,
  fatal,
  fav,
  info,
  note,
  pause,
  pending,
  star,
  start,
  success,
  warn,
  watch,
  log
} = signale;

Object.assign(console, {
  complete,
  error,
  debug,
  fatal,
  fav,
  info,
  note,
  pause,
  pending,
  star,
  start,
  success,
  warn,
  watch,
  log
});

module.exports = {
  name: "Logger"
};
