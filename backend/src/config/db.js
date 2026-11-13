import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'u803044110_sri_user',
  password: process.env.DB_PASSWORD || 'SriChaitanya@2026',
  database: process.env.DB_NAME || 'u803044110_srichaitanya',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

export const query = async (sql, params = []) => {
  const [rows] = await pool.query(sql, params);
  return rows;
};

export const getConnection = async () => {
  return await pool.getConnection();
};

export default pool;

