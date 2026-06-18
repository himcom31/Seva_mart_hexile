const mysql = require('mysql2/promise');
require('dotenv').config();

// .env me set karo: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'service_app',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true // DATETIME columns ko JS Date object ki jagah string return karega (sqlite jaisa behavior)
});

const initTables = async () => {
  const conn = await pool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(255),
        email      VARCHAR(255) NOT NULL UNIQUE,
        password   VARCHAR(255) NOT NULL,
        mobile     VARCHAR(20),
        role       VARCHAR(50) NOT NULL DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(255),
        email      VARCHAR(255) NOT NULL UNIQUE,
        password   VARCHAR(255) NOT NULL,
        role       VARCHAR(50) NOT NULL DEFAULT 'doctor',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS vendor_categories (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        name        VARCHAR(255) NOT NULL UNIQUE,
        slug        VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        icon        VARCHAR(255),
        is_active   TINYINT(1) NOT NULL DEFAULT 1,
        created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        language VARCHAR(10) NOT NULL DEFAULT 'en',
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        image VARCHAR(500),
        icon VARCHAR(500),
        description TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        featured TINYINT(1) NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS services (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        name          VARCHAR(255) NOT NULL,
        category_id   INT NOT NULL,
        code          VARCHAR(100) NOT NULL UNIQUE,
        slug          VARCHAR(255) NOT NULL UNIQUE,
        image         VARCHAR(500),
        icon          VARCHAR(500),
        description   TEXT,
        status        VARCHAR(50) NOT NULL DEFAULT 'active',
        verify_status VARCHAR(50) NOT NULL DEFAULT 'pending',
        featured      TINYINT(1) NOT NULL DEFAULT 0,
        created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS sub_services (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        service_id  INT NOT NULL,
        name        VARCHAR(255) NOT NULL,
        slug        VARCHAR(255) NOT NULL UNIQUE,
        image       VARCHAR(500),
        icon        VARCHAR(500),
        description TEXT,
        price       DECIMAL(10,2),
        status      VARCHAR(50) NOT NULL DEFAULT 'active',
        featured    TINYINT(1) NOT NULL DEFAULT 0,
        created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        mobile VARCHAR(20) NOT NULL UNIQUE,
        email VARCHAR(255),
        address TEXT,
        landmark VARCHAR(255),
        city VARCHAR(100),
        profile_photo VARCHAR(500),
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        is_blocked TINYINT(1) NOT NULL DEFAULT 0,
        total_bookings INT DEFAULT 0,
        completed_bookings INT DEFAULT 0,
        cancelled_bookings INT DEFAULT 0,
        last_booking_at DATETIME,
        registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS vendors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        mobile VARCHAR(20) NOT NULL UNIQUE,
        aadhaar VARCHAR(20) NOT NULL UNIQUE,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        experience INT DEFAULT 0,
        category_id INT,
        subcategory_id INT,
        city VARCHAR(100) NOT NULL,
        address TEXT,
        profile_photo VARCHAR(500),
        aadhaar_front VARCHAR(500),
        aadhaar_back VARCHAR(500),
        certificate VARCHAR(500),
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        verify_status VARCHAR(50) NOT NULL DEFAULT 'pending',
        is_available TINYINT(1) NOT NULL DEFAULT 1,
        vendor_type VARCHAR(50) NOT NULL DEFAULT 'individual',
        rating DECIMAL(3,2) DEFAULT 0,
        total_jobs INT DEFAULT 0,
        completed_jobs INT DEFAULT 0,
        cancelled_jobs INT DEFAULT 0,
        avg_response_time DECIMAL(10,2) DEFAULT 0,
        notes TEXT,
        registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS vendor_services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vendor_id INT NOT NULL,
        service_id INT NOT NULL,
        FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
        UNIQUE KEY uniq_vendor_service (vendor_id, service_id)
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS vendor_attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vendor_id INT NOT NULL,
        date VARCHAR(20) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'present',
        note TEXT,
        FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
        UNIQUE KEY uniq_vendor_date (vendor_id, date)
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS vendor_category_map (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vendor_id INT NOT NULL,
        vendor_category_id INT NOT NULL,
        FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
        FOREIGN KEY (vendor_category_id) REFERENCES vendor_categories(id) ON DELETE CASCADE,
        UNIQUE KEY uniq_vendor_category (vendor_id, vendor_category_id)
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id                     INT AUTO_INCREMENT PRIMARY KEY,
        booking_number         VARCHAR(50) NOT NULL UNIQUE,
        service_id             INT NOT NULL,
        service_name           VARCHAR(255) NOT NULL,
        category_name          VARCHAR(255),
        service_code           VARCHAR(100),
        full_name              VARCHAR(255) NOT NULL,
        mobile                 VARCHAR(20) NOT NULL,
        address                TEXT NOT NULL,
        landmark               VARCHAR(255),
        city                   VARCHAR(100) NOT NULL DEFAULT 'Patna',
        preferred_date         VARCHAR(20) NOT NULL,
        preferred_time         VARCHAR(20) NOT NULL,
        notes                  TEXT,
        status                 VARCHAR(50) NOT NULL DEFAULT 'pending',
        vendor_id              INT,
        vendor_name            VARCHAR(255),
        selected_sub_services  TEXT,
        created_at             DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at             DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
      )
    `);

    console.log('MySQL tables ready');
  } finally {
    conn.release();
  }
};

initTables().catch(err => console.error('Table init error:', err));

console.log(`MySQL Connected: ${process.env.DB_HOST || 'localhost'}/${process.env.DB_NAME || 'service_app'}`);

module.exports = pool;