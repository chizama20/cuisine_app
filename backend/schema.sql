-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS cuisine_db;
USE cuisine_db;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clientId VARCHAR(36) NOT NULL UNIQUE,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_phone (phone),
  INDEX idx_clientId (clientId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Recipes table
CREATE TABLE recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  region VARCHAR(100) NOT NULL,
  country VARCHAR(50) NOT NULL,
  author_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_author FOREIGN KEY (author_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ingredients table
CREATE TABLE ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recipe_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  amount VARCHAR(50) NOT NULL,
  CONSTRAINT fk_recipe_ingredient FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Steps table
CREATE TABLE steps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recipe_id INT NOT NULL,
  step_number INT NOT NULL,
  instruction TEXT NOT NULL,
  CONSTRAINT fk_recipe_step FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  UNIQUE(recipe_id, step_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Migration: Add ON DELETE CASCADE to existing databases
-- Run these if your tables already exist without cascade:
-- ALTER TABLE ingredients DROP FOREIGN KEY fk_recipe_ingredient;
-- ALTER TABLE ingredients ADD CONSTRAINT fk_recipe_ingredient FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE;
-- ALTER TABLE steps DROP FOREIGN KEY fk_recipe_step;
-- ALTER TABLE steps ADD CONSTRAINT fk_recipe_step FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE;
