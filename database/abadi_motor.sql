CREATE DATABASE IF NOT EXISTS abadi_motor
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE abadi_motor;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'pemilik') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS spare_parts (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(30) NOT NULL,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(80) NULL,
  unit VARCHAR(30) NOT NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  description VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_spare_parts_code (code),
  KEY idx_spare_parts_name (name)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS transactions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  spare_part_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  type ENUM('in', 'out') NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  notes VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_transactions_created_at (created_at),
  KEY idx_transactions_spare_part (spare_part_id),
  CONSTRAINT chk_transactions_quantity_positive CHECK (quantity > 0),
  CONSTRAINT fk_transactions_spare_part
    FOREIGN KEY (spare_part_id) REFERENCES spare_parts (id) ON DELETE RESTRICT,
  CONSTRAINT fk_transactions_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT
) ENGINE=InnoDB;
