require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// All routes
app.use(require('./routes'));

// Global error handler — HARUS paling terakhir
app.use(require('./middlewares/error'));

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
app.listen(PORT, () => {
  console.log(`Server berjalan di http://${HOST}:${PORT}`);
});