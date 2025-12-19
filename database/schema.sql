-- Database: simapan
-- Struktur tabel utama untuk menyimpan permohonan layanan administrasi.

CREATE TABLE IF NOT EXISTS service_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reference_no VARCHAR(50) NOT NULL,
  applicant_name VARCHAR(100) NOT NULL,
  service_type VARCHAR(100) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Menunggu',
  submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  INDEX idx_reference_no(reference_no),
  INDEX idx_status(status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Contoh data awal
INSERT INTO service_requests (reference_no, applicant_name, service_type, status, notes) VALUES
('SR-001', 'Siti Rohmah', 'Permohonan KK', 'Menunggu', 'Menunggu verifikasi berkas'),
('SR-002', 'Budi Pranoto', 'Legalitas Usaha', 'Proses', 'Sedang koordinasi dengan bidang terkait'),
('SR-003', 'Lestari Wulandari', 'Izin Reklame', 'Selesai', 'Diserahkan pada loket 2'),
('SR-004', 'Ahmad Fauzi', 'Data Kependudukan', 'Ditolak', 'Dokumen kurang lengkap');
