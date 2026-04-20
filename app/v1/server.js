const express = require('express');
const app = express();
const PORT = process.env.port || 3001;
const VERSION = process.env.APP_VERSION || 'v1.0';

let requestCount = 0;

app.use((req, res, next) => {
  requestCount++;
  console.log(`[BLUE][${VERSION}] Request #${requestCount}: ${req.method} ${req.path}`);
  next();
});

app.get('/heatlh', (req,res) => {
    res.json ({ status: 'healthy', version: VERSION, color: 'blue', requests: requestCount });    
});

app.get('/metrics', (req, res) => {
    res.json({ requests: reqiestCount, version: VERSION, uptime: process.uptime() });
});

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PHANTASM — Blue (${VERSION})</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #042C53; color: white; min-height: 100vh; }
    header { background: #185FA5; padding: 2rem; display: flex; justify-content: space-between; align-items: center; }
    h1 { font-size: 2rem; letter-spacing: 2px; }
    .version-badge { background: #378ADD; padding: 0.5rem 1.2rem; border-radius: 20px; font-size: 0.9rem; font-weight: bold; }
    .hero { text-align: center; padding: 4rem 2rem; }
    .hero h2 { font-size: 2.5rem; margin-bottom: 1rem; }
    .hero p { font-size: 1.2rem; color: #85B7EB; max-width: 500px; margin: 0 auto 2rem; }
    .products { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; padding: 2rem 4rem; }
    .product-card { background: #0C447C; border-radius: 12px; padding: 1.5rem; border: 1px solid #185FA5; }
    .product-card h3 { margin-bottom: 0.5rem; color: #B5D4F4; }
    .product-card p { color: #85B7EB; font-size: 0.9rem; }
    .product-card .price { font-size: 1.5rem; font-weight: bold; margin-top: 1rem; color: white; }
    footer { text-align: center; padding: 2rem; color: #378ADD; font-size: 0.85rem; }
  </style>
</head>
<body>
  <header>
    <h1>PHANTASM</h1>
    <span class="version-badge">BLUE — ${VERSION}</span>
  </header>
  <div class="hero">
    <h2>Product Catalog</h2>
    <p>Stable production version. Zero downtime. Always available.</p>
  </div>
  <div class="products">
    <div class="product-card">
      <h3>DevOps Handbook</h3>
      <p>The definitive guide to continuous delivery and infrastructure automation.</p>
      <div class="price">$49.99</div>
    </div>
    <div class="product-card">
      <h3>Docker Deep Dive</h3>
      <p>Master containerization from first principles to production orchestration.</p>
      <div class="price">$39.99</div>
    </div>
    <div class="product-card">
      <h3>AWS Solutions Architect</h3>
      <p>Cloud infrastructure design patterns for scalable modern applications.</p>
      <div class="price">$59.99</div>
    </div>
  </div>
  <footer>PHANTASM ${VERSION} — Blue Environment — Requests served: ${requestCount}</footer>
</body>
</html>`);
});

app.listen(PORT, () => {
    console.log(`PHANTASM Blue (${VERSION}) listening on port ${PORT}`);
});