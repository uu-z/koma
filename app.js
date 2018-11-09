const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const axios = require('axios');
const cache = require("koa-redis-cache")

var app = new Koa();
var router = new Router();

const { PORT = 8001 } = process.env;

app.use(bodyParser());
app.use(cors());
app.use(
	cache({
		redis: {
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_PORT
		},
		// routes: ['/index'],
		onerror(err) {
			console.log(err);
		}
	})
);


app.use(async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	console.log(`-> ${ctx.method} ${ctx.url} - ${ms}ms`);
});
app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		console.log(err);
		ctx.status = err.statusCode || err.status || 500;
		ctx.body = {
			message: err.message
		};
	}
});

router.post('/axios', async (ctx, next) => {
	let { data } = await axios(ctx.request.body);
	ctx.body = data;
});

router.get("/", async( ctx, next) => {
	const { url } = ctx.request.query
	let { data } = await axios.get(url)
	ctx.body = data;
})

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT);
console.info(`Server listening on port ${PORT}...`);
