const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const navbarRoutes = require('./routes/navbarRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/navbars', navbarRoutes);
app.use('/api/categories', categoryRoutes);

// Start Server and Seed Database
const startServer = async () => {
  try {
    // Seed default admin user
    const result = await pool.query('SELECT * FROM "Users" WHERE username = $1', ['admin']);
    if (result.rows.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password', salt);
      await pool.query(
        'INSERT INTO "Users" (username, password, role, "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW())',
        ['admin', hashedPassword, 'admin']
      );
      console.log('Default admin user created: admin / password');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error starting server or seeding admin:', err);
  }
};

startServer();
