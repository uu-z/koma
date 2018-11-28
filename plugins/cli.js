const Mhr = require("menhera").default;
const _ = require("lodash");
const cli = require("cac")();

module.exports = {
  name: "CLI",
  $commands: {
    $({ _key: name, _val }) {
      const { desc, options, examples, action } = _val;
      let command = cli.command(name, desc);
      if (options) {
        _.each((val, key) => {
          const { desc, ...other } = val;
          command.option(key, desc, other);
        });
      }
      if (examples) {
        examples.forEach(example => {
          command.example(example);
        });
      }
      if (action) {
        command.action(() => {
          let obj;
          cli.args.forEach(arg => {
            _.set;
          });
        });
      }
    }
  },
  $start: {
    cli: {
      _({ _val }) {
        const { version } = _val;
        cli.version(version);
        cli.help();
        cli.parse();
      },
      dev({ _val }) {
        if (_val) console.success("cli start~~~");
      }
    }
  }
  // commands: {
  //   "": {
  //     desc: "The default command",
  //     options: {},
  //     examples:[],
  //     action: (input, flags) => {}
  //   }
  // }
};
