const cac = require("cac");
const _ = require("lodash");
const cli = cac();

module.exports = {
  name: "CLI",
  $commands: {
    $({ _key: name, _val }) {
      const { handler, ...other } = _val;
      const key = `cli.commands.${name}`;
      let command = _.get(Mhr, key);
      Mhr.$use({ $_commands: { [name]: ({ _val: { input, flags } }) => handler(input, flags) } });
      if (command && other.options) {
        _.each((val, key) => {
          command.option(key, val);
        });
      } else {
        command = cli.command(name, other, (input, flags) => {
          Mhr.$use({ _commands: { [name]: { input, flags } } });
        });
        _.set(Mhr, key, command);
      }
    }
  },
  $start: {
    config({ _val }) {
      cli.parse();
    }
  },
  commands: {
    "*": {
      desc: "The default command",
      options: {},
      handler: (input, flags) => {
        console.success("cli start~~~");
      }
    }
  }
};
