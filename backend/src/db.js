import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'simapan',
  waitForConnections: true,
  connectionLimit: 10,
});

export async function query(sql, params) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function initDb() {
  await query(
    `CREATE TABLE IF NOT EXISTS service_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      reference_no VARCHAR(50) NOT NULL,
      applicant_name VARCHAR(100) NOT NULL,
      service_type VARCHAR(100) NOT NULL,
      status VARCHAR(30) NOT NULL DEFAULT 'Menunggu',
      submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      INDEX idx_reference_no(reference_no),
      INDEX idx_status(status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
  );
}
