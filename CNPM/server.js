const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');



const app = express();
const PORT = process.env.PORT || 3000;
const dataDir = path.join(__dirname, 'data');
const usersFile = path.join(dataDir, 'users.json');
const productsFile = path.join(dataDir, 'products.json');
const cartsFile = path.join(dataDir, 'carts.json');

const cartsFile = path.join(dataDir,'carts.json');
app.use(express.static(path.join(__dirname)));

const defaultProducts = [
  { id: 1, name: 'Áo thun HeyShop', price: 199000, description: 'Áo cotton mềm mịn, mặc thoải mái.', category: 'Thời trang' },
  { id: 2, name: 'Giày thể thao', price: 499000, description: 'Giày chạy bộ nhẹ, đế êm.', category: 'Giày dép' },
  { id: 3, name: 'Balo du lịch', price: 329000, description: 'Balo chống nước, nhiều ngăn.', category: 'Phụ kiện' },
  { id: 4, name: 'Mũ lưỡi trai', price: 89000, description: 'Mũ thời trang, che nắng tốt.', category: 'Phụ kiện' },
  { id: 5, name: 'Tai nghe Bluetooth', price: 259000, description: 'Âm thanh rõ, kết nối không dây.', category: 'Điện tử' }
];

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

async function readJson(filePath, defaultData) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content || JSON.stringify(defaultData));
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeJson(filePath, defaultData);
      return defaultData;
    }
    throw error;
  }
}

async function ensureDataFiles() {
  await fs.mkdir(dataDir, { recursive: true });
  await readJson(usersFile, []);
  await readJson(productsFile, defaultProducts);
  await readJson(cartsFile, {});
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// chặn truy cập trực tiếp vào thư mục data
app.use('/data', (req, res) => res.status(404).end());
app.use(express.static(__dirname));
// Serve HTML pages placed under the pages/ directory as static files
app.use(express.static(path.join(__dirname, 'pages')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'HeyShop Backend' });
});

app.get('/api/products', async (req, res) => {
  const products = await readJson(productsFile, defaultProducts);
  res.json({ products });
});

app.get('/api/products/:id', async (req, res) => {
  const products = await readJson(productsFile, defaultProducts);
  const product = products.find((item) => item.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

app.post('/api/register', async (req, res) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    return res.status(400).json({ error: 'fullname, email and password are required' });
  }

  const users = await readJson(usersFile, []);
  if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const newUser = {
    id: Date.now(),
    fullname,
    email: email.toLowerCase(),
    password: hashPassword(password),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  await writeJson(usersFile, users);

  const { password: removed, ...userPublic } = newUser;
  res.json({ success: true, user: userPublic });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const users = await readJson(usersFile, []);
  const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== hashPassword(password)) {
    return res.status(401).json({ error: 'Email or password is incorrect' });
  }

  const { password: removed, ...userPublic } = user;
  res.json({ success: true, user: userPublic });
});

app.get('/api/cart', async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  const carts = await readJson(cartsFile, {});
  res.json({ cart: carts[email.toLowerCase()] || [] });
});

app.post('/api/cart', async (req, res) => {
  const { email, items } = req.body;
  if (!email || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Email and items are required' });
  }

  const users = await readJson(usersFile, []);
  if (!users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'User not found' });
  }

  const carts = await readJson(cartsFile, {});
  carts[email.toLowerCase()] = items;
  await writeJson(cartsFile, carts);

  res.json({ success: true, cart: items });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

ensureDataFiles()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`HeyShop backend is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to initialize backend data files:', error);
    process.exit(1);
  });
