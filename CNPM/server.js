const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'HeyShop Backend' });
});

app.get('/api/products', (req, res) => {
  res.json({
    products: [
      { id: 1, name: 'Sample Product 1', price: 199000 },
      { id: 2, name: 'Sample Product 2', price: 299000 }
    ]
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  res.json({
    success: true,
    message: 'Login successful',
    user: { email }
  });
});

app.post('/api/register', (req, res) => {
  const { email, password, fullname } = req.body;
  if (!email || !password || !fullname) {
    return res.status(400).json({ error: 'Full name, email, and password are required.' });
  }

  res.json({
    success: true,
    message: 'Registration successful',
    user: { email, fullname }
  });
});

app.get('/api/cart', (req, res) => {
  res.json({
    cart: [],
    message: 'Cart endpoint is ready for integration.'
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`HeyShop backend is running on http://localhost:${PORT}`);
});
