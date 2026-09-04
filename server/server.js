import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);
const dbName = process.env.DB_NAME || 'stockhub';
const jwtSecret = process.env.JWT_SECRET || 'stockhub-dev-secret-change-me';

app.use(cors());
app.use(express.json());

const baseDbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

const pool = mysql.createPool({
  ...baseDbConfig,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const resourceConfig = {
  barang: {
    table: 'barang',
    columns: [
      'id',
      'kode',
      'nama',
      'kategori',
      'stok',
      'satuan',
      'minimumStok',
      'supplier',
      'expiredDate',
      'rak',
      'catatan',
      'hargaBeli',
      'hargaJual',
    ],
  },
  kategori: {
    table: 'kategori',
    columns: ['id', 'nama'],
  },
  supplier: {
    table: 'supplier',
    columns: ['id', 'nama', 'kontak', 'telepon', 'email', 'lokasi', 'leadTime'],
  },
};

async function ensureDatabase() {
  const connection = await mysql.createConnection(baseDbConfig);

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.query(`USE \`${dbName}\``);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS kategori (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        nama VARCHAR(150) NOT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS supplier (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        nama VARCHAR(150) NOT NULL,
        kontak VARCHAR(150) DEFAULT NULL,
        telepon VARCHAR(50) DEFAULT NULL,
        email VARCHAR(150) DEFAULT NULL,
        lokasi VARCHAR(150) DEFAULT NULL,
        leadTime VARCHAR(50) DEFAULT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS barang (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        kode VARCHAR(100) NOT NULL,
        nama VARCHAR(255) NOT NULL,
        kategori VARCHAR(100) DEFAULT NULL,
        stok INT DEFAULT 0,
        satuan VARCHAR(50) DEFAULT NULL,
        minimumStok INT DEFAULT 0,
        supplier VARCHAR(150) DEFAULT NULL,
        expiredDate DATE DEFAULT NULL,
        rak VARCHAR(50) DEFAULT NULL,
        catatan TEXT DEFAULT NULL,
        hargaBeli DECIMAL(12,2) DEFAULT 0,
        hargaJual DECIMAL(12,2) DEFAULT 0,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        username VARCHAR(100) NOT NULL UNIQUE,
        nama VARCHAR(150) NOT NULL,
        role ENUM('admin', 'bos') NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const defaultUsers = [
      {
        username: process.env.ADMIN_USERNAME || 'admin',
        nama: 'Administrator',
        role: 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
      },
      {
        username: process.env.BOS_USERNAME || 'bos',
        nama: 'Bos',
        role: 'bos',
        password: process.env.BOS_PASSWORD || 'bos123',
      },
    ];

    for (const user of defaultUsers) {
      const passwordHash = await bcrypt.hash(user.password, 12);
      await connection.query(
        `INSERT INTO users (username, nama, role, password_hash) VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE nama = VALUES(nama), role = VALUES(role)`,
        [user.username, user.nama, user.role, passwordHash]
      );
    }

    const tables = ['kategori', 'supplier', 'barang'];

    for (const table of tables) {
      await connection.query(`ALTER TABLE \`${dbName}\`.\`${table}\` MODIFY id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;`);
      await connection.query(`DELETE FROM \`${dbName}\`.\`${table}\` WHERE id = 0;`);
    }
  } finally {
    await connection.end();
  }
}

function createToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, nama: user.nama, role: user.role },
    jwtSecret,
    { expiresIn: '8h' }
  );
}

function authenticate(req, res, next) {
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ')
    ? authorization.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Sesi login diperlukan.' });
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ message: 'Sesi login tidak valid atau sudah kedaluwarsa.' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Akses ini hanya untuk admin.' });
  }

  return next();
}

async function getCollection(resource) {
  const config = resourceConfig[resource];

  if (!config) {
    throw new Error('Resource tidak ditemukan');
  }

  const [rows] = await pool.query(`SELECT * FROM \`${config.table}\` ORDER BY id ASC`);
  return rows;
}

function normalizeRow(resource, item = {}) {
  const config = resourceConfig[resource];
  if (!config) {
    throw new Error('Resource tidak ditemukan');
  }

  const normalized = {};

  config.columns.forEach((column) => {
    if (column === 'id') {
      normalized[column] = item.id ?? null;
      return;
    }

    const value = item[column];
    normalized[column] = value === undefined || value === null ? null : value;
  });

  return normalized;
}

async function createRow(resource, payload) {
  const config = resourceConfig[resource];
  const item = normalizeRow(resource, payload);

  const columns = config.columns.filter((column) => column !== 'id');
  const placeholders = columns.map(() => '?').join(', ');
  const values = columns.map((column) => item[column]);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [result] = await connection.query(
      `INSERT INTO \`${config.table}\` (${columns.map((column) => `\`${column}\``).join(', ')}) VALUES (${placeholders})`,
      values
    );

    const inserted = { ...item, id: result.insertId };
    await connection.commit();
    return inserted;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function updateRow(resource, id, payload) {
  const config = resourceConfig[resource];
  const item = normalizeRow(resource, payload);
  const updates = config.columns
    .filter((column) => column !== 'id')
    .map((column) => `\`${column}\` = ?`);

  const values = config.columns
    .filter((column) => column !== 'id')
    .map((column) => item[column]);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query(
      `UPDATE \`${config.table}\` SET ${updates.join(', ')} WHERE id = ?`,
      [...values, Number(id)]
    );

    const [rows] = await connection.query(`SELECT * FROM \`${config.table}\` WHERE id = ?`, [Number(id)]);
    await connection.commit();
    return rows[0];
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function deleteRow(resource, id) {
  const config = resourceConfig[resource];
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query(`DELETE FROM \`${config.table}\` WHERE id = ?`, [Number(id)]);
    await connection.commit();
    return { id: Number(id) };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

app.get('/health', (_, res) => {
  res.json({ status: 'ok', database: dbName });
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const username = String(req.body?.username || '').trim();
    const password = String(req.body?.password || '');
    const [rows] = await pool.query(
      'SELECT id, username, nama, role, password_hash FROM users WHERE username = ? LIMIT 1',
      [username]
    );
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: 'Username atau password salah.' });
    }

    const publicUser = {
      id: user.id,
      username: user.username,
      nama: user.nama,
      role: user.role,
    };
    return res.json({ token: createToken(publicUser), user: publicUser });
  } catch (error) {
    return res.status(500).json({ message: 'Login gagal.', error: error.message });
  }
});

app.get('/api/:resource', authenticate, async (req, res) => {
  try {
    const { resource } = req.params;
    const result = await getCollection(resource);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data dari database.',
      error: error.message,
    });
  }
});

app.post('/api/:resource', authenticate, requireAdmin, async (req, res) => {
  try {
    const { resource } = req.params;
    const result = await createRow(resource, req.body || {});
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal menambah data di database.',
      error: error.message,
    });
  }
});

app.put('/api/:resource/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { resource, id } = req.params;
    const result = await updateRow(resource, id, req.body || {});
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal memperbarui data di database.',
      error: error.message,
    });
  }
});

app.delete('/api/:resource/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { resource, id } = req.params;
    const result = await deleteRow(resource, id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal menghapus data dari database.',
      error: error.message,
    });
  }
});

async function startServer() {
  await ensureDatabase();

  app.listen(port, () => {
    console.log(`Server MySQL aktif di http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Tidak dapat terhubung ke MySQL. Pastikan MySQL aktif dan .env sudah benar.');
  console.error(error.message);
  process.exit(1);
});
