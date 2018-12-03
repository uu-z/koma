import { koma } from "../../../index.js";
import * as path from "path";

koma.$use({
  start: {
    metas: {
      mongoose: { load: true }
    },
    load: {
      plugins: [],
      modules: [path.join(__dirname, "./modules")]
    },
    config: {
      PORT: 8001,
      RUN: true
    }
  }
});
