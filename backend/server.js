import app from './src/app.js';
import pool from './src/config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Verify MySQL connection
    const connection = await pool.getConnection();
    console.log('✅ Successfully connected to MySQL database: ' + (process.env.DB_NAME || 'u302322072_bookcom123'));
    connection.release();

    app.listen(PORT, () => {
      console.log(`🚀 Sri Chaitanya Books API server running on port ${PORT}`);
      console.log(`📡 Base URL: http://localhost:${PORT}/api`);
      console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();

