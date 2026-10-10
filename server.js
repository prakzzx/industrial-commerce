/**
 * INDXO AI / XMACH Industrial Purchase Portal
 * Standalone Development HTTP & REST API Server
 * Runtime: Node.js (Zero external npm dependency requirement)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'apps', 'purchase-web', 'dist');
const WEB_ROOT = fs.existsSync(distPath) ? distPath : path.join(__dirname, 'apps', 'purchase-web');

// Seed In-Memory Store
const STORE = {
  categories: [
    { id: 'cutting_tools', name: 'Cutting Tools & Inserts', count: 24 },
    { id: 'consumables', name: 'Consumables & Coolants', count: 18 },
    { id: 'raw_materials', name: 'Raw Materials (Steel/Alu)', count: 32 },
    { id: 'cnc_spares', name: 'CNC Spares & Batteries', count: 14 },
    { id: 'plc_automation', name: 'PLC & Automation', count: 20 },
    { id: 'sensors_iiot', name: 'Sensors & IIoT Gateways', count: 16 },
    { id: 'electrical', name: 'Electrical & Switchgear', count: 28 },
    { id: 'mechanical', name: 'Mechanical & Bearings', count: 22 },
    { id: 'machine_accessories', name: 'Machine Accessories & Collets', count: 19 },
    { id: 'quality_metrology', name: 'Quality & Metrology', count: 12 }
  ],
  products: [
    {
      id: 'PROD-001',
      name: 'Sandvik CoroTurn CNMG 12 04 08-PM 4325 Carbide Insert',
      category: 'cutting_tools',
      brand: 'Sandvik',
      sku: 'INS-CNMG-120408',
      hsn: '82090010',
      uom: 'PACK of 10',
      moq: 1,
      taxRate: 18,
      price: 1850,
      vendor: 'Apex Industrial Tooling'
    },
    {
      id: 'PROD-002',
      name: 'FANUC 3V Lithium Backup Battery A06B-6114-K504',
      category: 'cnc_spares',
      brand: 'FANUC',
      sku: 'BAT-FANUC-3V',
      hsn: '85065000',
      uom: 'NOS',
      moq: 1,
      taxRate: 18,
      price: 2450,
      vendor: 'CNC Parts Direct Bengaluru'
    },
    {
      id: 'PROD-003',
      name: 'Blaser Swisslube B-Cool 755 Synthetic Coolant (20L Drum)',
      category: 'consumables',
      brand: 'Blaser',
      sku: 'COOL-SYNTH-20L',
      hsn: '34031900',
      uom: 'CAN 20 LTR',
      moq: 1,
      taxRate: 18,
      price: 9200,
      vendor: 'Maharshi Lubricants Chakan'
    }
  ],
  orders: []
};

// MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Tenant-ID');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- REST API ENDPOINTS ---
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');

    // GET /api/health
    if (pathname === '/api/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'HEALTHY', module: 'indxo-purchase-portal', timestamp: new Date().toISOString() }));
      return;
    }

    // GET /api/catalog/categories
    if (pathname === '/api/catalog/categories') {
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: STORE.categories }));
      return;
    }

    // GET /api/catalog/products
    if (pathname === '/api/catalog/products') {
      const q = (parsedUrl.query.q || '').toLowerCase();
      let results = STORE.products;
      if (q) {
        results = results.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
      }
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, count: results.length, data: results }));
      return;
    }

    // POST /api/checkout/validate
    if (pathname === '/api/checkout/validate' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            valid: true,
            taxEstimate: { cgst: 9, sgst: 9, igst: 18 },
            freightPolicy: 'STANDARD_150_PER_VENDOR'
          }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: 'Malformed JSON' }));
        }
      });
      return;
    }

    // Default 404 for unknown APIs
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint not found', path: pathname }));
    return;
  }

  // --- STATIC FILE SERVING ---
  let filePath = path.join(WEB_ROOT, pathname === '/' ? 'index.html' : pathname);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA routing
      filePath = path.join(WEB_ROOT, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Internal Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`INDXO AI / XMACH - Industrial Purchase Portal`);
  console.log(`Live Server running at http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
