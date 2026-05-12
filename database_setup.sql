-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0+ (MySQL / MariaDB)
-- --------------------------------------------------------

-- --------------------------------------------------------
-- Database: sabana_project
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

-- --------------------------------------------------------
-- RESET DATABASE
-- --------------------------------------------------------
DROP DATABASE IF EXISTS `sabana_project`;
CREATE DATABASE `sabana_project`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `sabana_project`;

-- --------------------------------------------------------
-- TABLE: pengguna
-- --------------------------------------------------------
DROP TABLE IF EXISTS `pengguna`;
CREATE TABLE `pengguna` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(100),
  `email` VARCHAR(100) UNIQUE,
  `password` VARCHAR(255),
  `peran` ENUM('admin','pelanggan'),
  `dibuat_pada` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- DATA ADMIN DEFAULT
INSERT INTO `pengguna` (`nama`, `email`, `password`, `peran`) VALUES
('Admin Sabana', 'adminsabana123@gmail.com', 'sabana_Project_RPL', 'admin');

-- --------------------------------------------------------
-- TABLE: menu
-- --------------------------------------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu` (
  `id` INT PRIMARY KEY,
  `nama_menu` VARCHAR(150),
  `harga` INT,
  `kategori` VARCHAR(50),
  `deskripsi` TEXT NULL,
  `gambar` VARCHAR(255) NULL,
  `status` ENUM('tersedia','habis') DEFAULT 'tersedia'
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- DATA: menu
-- --------------------------------------------------------
INSERT INTO `menu` (`id`, `nama_menu`, `harga`, `kategori`, `deskripsi`, `gambar`, `status`) VALUES
(1, 'Ayam Goreng Dada', 11000, 'Reguler', 'Ayam goreng bagian dada, gurih dan crispy', 'ayam_dada.jpg', 'tersedia'),
(2, 'Ayam Goreng Paha Atas', 11000, 'Reguler', 'Ayam goreng paha atas dengan bumbu khas', 'paha_atas.jpg', 'tersedia'),
(3, 'Ayam Goreng Paha Bawah', 9000, 'Reguler', 'Ayam goreng paha bawah renyah', 'paha_bawah.jpg', 'tersedia'),
(4, 'Ayam Goreng Sayap', 9000, 'Reguler', 'Sayap ayam goreng crispy', 'sayap.jpg', 'tersedia'),
(5, 'Burger Ayam', 12000, 'Tambahan', 'Burger dengan isian ayam crispy', 'burger_ayam.jpg', 'tersedia'),
(6, 'Rice Box', 12000, 'Tambahan', 'Nasi dengan lauk ayam dalam box praktis', 'rice_box.jpg', 'tersedia'),
(7, 'Kentang Goreng', 8000, 'Tambahan', 'Kentang goreng renyah', 'kentang.jpg', 'tersedia'),
(8, 'Nasi Putih', 4000, 'Tambahan', 'Nasi putih hangat', 'nasi.jpg', 'tersedia'),
(9, 'Kulit Crispy', 5000, 'Tambahan', 'Kulit ayam goreng crispy', 'kulit.jpg', 'tersedia'),
(10, 'Chicken Strips', 4000, 'Tambahan', 'Potongan ayam goreng kecil', 'strips.jpg', 'tersedia'),
(11, 'Bakso Goreng', 4000, 'Tambahan', 'Bakso goreng gurih', 'bakso.jpg', 'tersedia'),
(12, 'Chicken Roll', 4000, 'Tambahan', 'Olahan ayam berbentuk roll', 'roll.jpg', 'tersedia'),
(13, 'Es Teh', 3000, 'Tambahan', 'Minuman teh dingin segar', 'esteh.jpg', 'tersedia'),
(14, 'Paket 1 (Ayam Dada + Nasi + Es Teh)', 20000, 'Paket', 'Paket hemat ayam dada lengkap', 'paket1.jpg', 'tersedia'),
(15, 'Paket 2 (Ayam Sayap + Nasi + Es Teh)', 18000, 'Paket', 'Paket ayam sayap lengkap', 'paket2.jpg', 'tersedia'),
(16, 'Paket 3 (Ayam Sambal Geprek + Nasi + Es Teh)', 25000, 'Paket', 'Ayam geprek pedas lengkap', 'paket3.jpg', 'tersedia'),
(17, 'Paket 4 (Ayam Sambal Ijo + Nasi + Es Teh)', 25000, 'Paket', 'Ayam sambal ijo khas', 'paket4.jpg', 'tersedia'),
(18, 'Combo 1 (3 pcs Sayap / Paha Bawah)', 25000, 'Paket Combo', 'Combo 3 potong ayam', 'combo1.jpg', 'tersedia'),
(19, 'Combo 2 (5 pcs Sayap / Paha Bawah)', 41000, 'Paket Combo', 'Combo 5 potong ayam', 'combo2.jpg', 'tersedia'),
(20, 'Combo 3 (7 pcs Sayap / Paha Bawah)', 56000, 'Paket Combo', 'Combo 7 potong ayam', 'combo3.jpg', 'tersedia');

-- --------------------------------------------------------
-- TABLE: pesanan
-- --------------------------------------------------------
DROP TABLE IF EXISTS `pesanan`;
CREATE TABLE `pesanan` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_pengguna` INT,
  `jenis_pesanan` ENUM('takeaway','delivery'),
  `total_harga` INT,
  `nomor_antrian` INT,
  `status` ENUM('menunggu','diproses','dikirim','diterima','selesai') DEFAULT 'menunggu',
  `dibuat_pada` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `diupdate_pada` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna`(`id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- TABLE: detail_pesanan
-- --------------------------------------------------------
DROP TABLE IF EXISTS `detail_pesanan`;
CREATE TABLE `detail_pesanan` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_pesanan` INT,
  `id_menu` INT,
  `jumlah` INT,
  `harga` INT,
  `subtotal` INT,
  FOREIGN KEY (`id_pesanan`) REFERENCES `pesanan`(`id`),
  FOREIGN KEY (`id_menu`) REFERENCES `menu`(`id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- TABLE: pembayaran
-- --------------------------------------------------------
DROP TABLE IF EXISTS `pembayaran`;
CREATE TABLE `pembayaran` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_pesanan` INT,
  `metode_pembayaran` ENUM('qris','cash'),
  `jumlah_bayar` INT,
  `status_pembayaran` ENUM('sudah_bayar','belum_bayar') DEFAULT 'belum_bayar',
  `kode_qr` VARCHAR(255),
  `waktu_bayar` TIMESTAMP NULL,
  FOREIGN KEY (`id_pesanan`) REFERENCES `pesanan`(`id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- TABLE: pengiriman
-- --------------------------------------------------------
DROP TABLE IF EXISTS `pengiriman`;
CREATE TABLE `pengiriman` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_pesanan` INT,
  `alamat` TEXT,
  `deskripsi` TEXT,
  `status_pengiriman` ENUM('menunggu','dikirim','diterima') DEFAULT 'menunggu',
  `waktu_pengiriman` TIMESTAMP NULL,
  FOREIGN KEY (`id_pesanan`) REFERENCES `pesanan`(`id`)
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- RESET CONFIG
-- --------------------------------------------------------
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
