const Koa = require('koa');
const Router = require('koa-router');
const Logger = require('koa-logger');
const BodyParser = require('koa-bodyparser');
const Static = require('koa-static');
const Send = require('koa-send');

const jsonDb = require('./jsonDb');
const { randomSleep } = require('./sleep');

const port = 8090;
const staticDir = 'dist';

const app = new Koa();
const router = new Router({
  prefix: '/api',
});

router.get('/transactions', async (ctx) => {
  await randomSleep();
  ctx.body = await jsonDb.getAll();
});

// C
router.post('/transactions', async (ctx) => {
  await randomSleep();
  ctx.body = await jsonDb.create(ctx.request.body);
});

// R
router.get('/transactions/:id', async (ctx) => {
  await randomSleep();
  const transaction = await jsonDb.get(parseInt(ctx.params.id, 10));
  if (typeof transaction !== 'undefined') {
    ctx.body = transaction;
  }
});

// U
router.put('/transactions/:id', async (ctx) => {
  await randomSleep();
  const transaction = await jsonDb.update({
    ...ctx.request.body,
    id: parseInt(ctx.params.id, 10),
  });
  if (typeof transaction !== 'undefined') {
    ctx.body = transaction;
  }
});

// D
router.delete('/transactions/:id', async (ctx) => {
  await randomSleep();
  if (await jsonDb.remove(parseInt(ctx.params.id, 10))) {
    ctx.body = '';
  }
});

app
  .use(Logger())
  .use(BodyParser())
  .use(Static(staticDir))
  .use(router.routes())
  .use(router.allowedMethods())
  .use(async (ctx) => {
    if (ctx.path.substr(0, 4) !== '/api') {
      await Send(ctx, `${staticDir}/index.html`);
    }
  });

console.info(`api listening on http://localhost:${port}`);

app.listen(port);
