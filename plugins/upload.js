const Mhr = require("menhera").default;
const multer = require("koa-multer");
const static = require("koa-static");
const { utils } = require("../packages/core/utils");
const path = require("path");
const crypto = require("crypto");

module.exports = {
  name: "Upload",
  use: [static("./public")],
  $multer: utils.injectMethods("methods", { type: "multer" }),
  $start: {
    router() {
      Mhr.$use({
        routes: {
          "post /upload": "uploads|handleFiles"
        }
      });
    }
  },
  controllers: {
    async handleFiles(ctx) {
      ctx.body = ctx.req.files;
    }
  },
  multer: {
    uploads: multer({
      storage: multer.diskStorage({
        destination: "public/uploads",
        filename(req, file, cb) {
          cb(null, crypto.randomBytes(10).toString("hex") + path.extname(file.originalname));
        }
      })
    }).array("files")
  }
};
