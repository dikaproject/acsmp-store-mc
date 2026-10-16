const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const express = require('express');
const jwt = require('jsonwebtoken');
const { createDigitalProductController } = require('../src/controllers/digitalProductController');
const validation = require('../src/middleware/digitalProductValidation');
const upload = require('../src/config/multer');
const errorHandler = require('../src/middleware/errorHandler');
const { removeDigitalProductImage } = require('../src/utils/digitalProductImages');

const uploadDirectory = path.resolve(__dirname, '../uploads/digital-products');
const imagePath = (url) => path.join(uploadDirectory, path.basename(url));
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jAv0AAAAASUVORK5CYII=', 'base64');

const startServer = async (t, app) => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  return `http://127.0.0.1:${server.address().port}`;
};

const form = (fields, withImage = true, filename = 'product.png') => {
  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) body.append(key, value);
  if (withImage) body.append('image', new Blob([png], { type: 'image/png' }), filename);
  return body;
};

const createTestApp = (database) => {
  const controller = createDigitalProductController(database);
  const app = express();
  app.use(express.json());
  const router = express.Router();
  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', upload.single('image'), validation.create, controller.create);
  router.put('/:id', upload.single('image'), validation.update, controller.update);
  router.delete('/:id', controller.delete);
  app.use('/api/digital-products', router);
  app.use(errorHandler);
  return app;
};

test('digital products support CRUD, use image extensions, retain existing images, replace and delete uploaded files', async (t) => {
  let record;
  const database = { digitalProduct: {
    findMany: async () => record ? [record] : [],
    findUnique: async ({ where }) => record?.id === where.id ? record : null,
    create: async ({ data }) => (record = { id: 'digital-1', ...data }),
    update: async ({ data }) => (record = { ...record, ...data }),
    delete: async () => { record = undefined; }
  } };
  const base = `${await startServer(t, createTestApp(database))}/api/digital-products`;
  const files = [];
  t.after(async () => { await Promise.all(files.map((file) => fs.unlink(file).catch(() => {}))); });

  const created = await fetch(base, { method: 'POST', body: form({
    title: '  Website Template  ', description: 'Plain text\nSecond line', redirectUrl: 'https://wa.me/628123456789'
  }, true, 'product.html') });
  assert.equal(created.status, 201);
  const product = (await created.json()).data;
  files.push(imagePath(product.imageUrl));
  assert.equal(product.title, 'Website Template');
  assert.equal(product.description.replace(/\r\n/g, '\n'), 'Plain text\nSecond line');
  assert.equal(product.redirectUrl, 'https://wa.me/628123456789');
  assert.match(product.imageUrl, /^\/uploads\/digital-products\/.+\.png$/);
  await fs.access(files[0]);

  const list = await (await fetch(base)).json();
  assert.equal(list.success, true);
  assert.equal(list.data.length, 1);
  assert.equal((await (await fetch(`${base}/${product.id}`)).json()).data.id, product.id);

  const edited = await fetch(`${base}/${product.id}`, { method: 'PUT', body: form({ title: 'Updated title' }, false) });
  assert.equal(edited.status, 200);
  assert.equal((await edited.json()).data.imageUrl, product.imageUrl);
  assert.equal(record.description, product.description);
  await fs.access(files[0]);

  const replaced = await fetch(`${base}/${product.id}`, { method: 'PUT', body: form({ redirectUrl: 'https://example.com/contact' }) });
  assert.equal(replaced.status, 200);
  const newImageUrl = (await replaced.json()).data.imageUrl;
  assert.notEqual(newImageUrl, product.imageUrl);
  files.push(imagePath(newImageUrl));
  await assert.rejects(fs.access(files[0]), { code: 'ENOENT' });
  await fs.access(files[1]);

  assert.equal((await fetch(`${base}/${product.id}`, { method: 'DELETE' })).status, 200);
  await assert.rejects(fs.access(files[1]), { code: 'ENOENT' });
  assert.equal((await fetch(`${base}/${product.id}`)).status, 404);
  assert.equal((await fetch(`${base}/${product.id}`, { method: 'PUT', body: form({ title: 'Missing' }, false) })).status, 404);
  assert.equal((await fetch(`${base}/${product.id}`, { method: 'DELETE' })).status, 404);
  assert.deepEqual((await (await fetch(base)).json()).data, []);
});

test('creation requires a photo and rejects invalid URLs, empty fields, non-text descriptions and oversized text', async (t) => {
  let writes = 0;
  const database = { digitalProduct: { create: async () => { writes += 1; } } };
  const base = `${await startServer(t, createTestApp(database))}/api/digital-products`;
  const valid = { title: 'Product', description: 'Description', redirectUrl: 'https://wa.me/628123456789' };

  const missingImage = await fetch(base, { method: 'POST', body: form(valid, false) });
  assert.equal(missingImage.status, 400);
  assert.equal((await missingImage.json()).message, 'Image is required');

  for (const fields of [
    { redirectUrl: 'javascript:alert(1)' }, { redirectUrl: 'data:text/html,hello' },
    { redirectUrl: 'wa.me/628123456789' }, { redirectUrl: 'https://user:password@example.com' },
    { title: '   ' }, { title: 'a'.repeat(192) }, { description: '' },
    { description: 'a'.repeat(10001) }, { description: { richText: true } }
  ]) {
    const response = await fetch(base, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...valid, ...fields })
    });
    assert.equal(response.status, 400, JSON.stringify(fields));
    assert.equal((await response.json()).message, 'Validation error');
  }
  assert.equal(writes, 0);
});

test('failed database writes and validation errors remove their newly uploaded images', async (t) => {
  await fs.mkdir(uploadDirectory, { recursive: true });
  const filename = `test-${Date.now()}-validation.png`;
  const filepath = path.join(uploadDirectory, filename);
  await fs.writeFile(filepath, png);
  t.after(() => fs.unlink(filepath).catch(() => {}));
  const app = express();
  app.use(express.json());
  app.post('/', (req, res, next) => { req.file = { filename }; next(); }, validation.create, (req, res) => res.sendStatus(201));
  const base = await startServer(t, app);
  assert.equal((await fetch(base, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })).status, 400);
  await assert.rejects(fs.access(filepath), { code: 'ENOENT' });

  await fs.writeFile(filepath, png);
  const error = new Error('Database write failed');
  const controller = createDigitalProductController({ digitalProduct: { create: async () => { throw error; } } });
  let receivedError;
  await controller.create({ body: {}, file: { filename } }, {}, (value) => { receivedError = value; });
  assert.equal(receivedError, error);
  await assert.rejects(fs.access(filepath), { code: 'ENOENT' });
});

test('production digital product routes reject anonymous and player mutations before uploads', async (t) => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'digital-product-test-secret';
  t.after(() => {
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  });
  const app = express();
  app.use('/api/digital-products', require('../src/routes/digitalProduct'));
  const base = `${await startServer(t, app)}/api/digital-products`;
  const token = jwt.sign({ role: 'PLAYER', minecraftName: 'TestPlayer' }, process.env.JWT_SECRET);
  for (const [method, endpoint] of [['POST', base], ['PUT', `${base}/missing`], ['DELETE', `${base}/missing`]]) {
    assert.equal((await fetch(endpoint, { method })).status, 401);
    assert.equal((await fetch(endpoint, { method, headers: { Authorization: `Bearer ${token}` } })).status, 403);
  }
});

test('image cleanup cannot remove files outside the digital product directory', async (t) => {
  const filename = `digital-product-safety-${Date.now()}.png`;
  const filepath = path.resolve(__dirname, '../uploads', filename);
  await fs.writeFile(filepath, png);
  t.after(() => fs.unlink(filepath).catch(() => {}));
  await removeDigitalProductImage(`/uploads/digital-products/../${filename}`);
  await removeDigitalProductImage(`/uploads/${filename}`);
  await fs.access(filepath);
});
