const _ = require("lodash")
const bcrypt = require("mongoose-bcrypt")


module.exports = {
  name: "User",
  mixouts: {
    global: "User",
  },
  routes: {
    "post /users": "User.controllers.create",
    "get /users/:_id": "User.controllers.findOne",
    "put /users/:_id": "User.controllers.update",
    "get /users": "User.controllers.list",
  },
  controllers: {
    async create(ctx,next){
      ctx.body = await User.services.add(ctx.request.body)
    },
    async list(ctx,next) {
      ctx.body = await User.services.fetchAll(ctx.query)
    },
    async findOne(ctx,next){
      if (!ctx.params.id.match(/^[0-9a-fA-F]{24}$/)) return ctx.notFound();

      ctx.body = await User.services.fetch(ctx.params)
    },
    async update(ctx,next){
      await User.services.edit(ctx.params, ctx.request.body)
      ctx.body = await User.services.fetch(ctx.params)
    }
  },
  services:{
    async add(values){
      const {User:{schema :Userschema, model: UserModel}} = User.models
      const data = _.pick(values, _.keys(Userschema))

      return await UserModel.create(data)
    },
    async fetch(params){
      const {User:{model: UserModel}} = User.models

      return await UserModel.findOne(params)
    },
    async fetchAll(params){
      const {User:{model: UserModel}} = User.models
      for(let [k,v] of Object.entries(params)){
        params[k] = JSON.parse(v)
      }

      return await UserModel.paginate(params.query || {}, params.paginate || {})
    },
    async edit(params, values){
      const {User:{schema :Userschema, model: UserModel}} = User.models
      const data = _.pick(values, _.keys(Userschema))

      return await UserModel.update(params, data)
    }
  },
  models: {
    User: {
      schema: {
        username: {
          type: 'string',
          default: null
        },
        email: {
          type: 'string',
          required: true,
          unique: true
        },
        password: {
          type: "string",
          select: false,
          required: true,
          bcrypt: true
        },
        secret:{
          type: "string",
          bcrypt: true
        }
      },
      plugins: [bcrypt],
      set:{
        toJSON:{
          transform(doc,ret,opt){
            delete ret['password']
            return ret
          }
        }
      }
    }
  }
};
