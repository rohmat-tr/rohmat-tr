import { Router } from 'express';
import { initDb, query } from '../db.js';

const router = Router();

initDb();

const mapStatus = (status) => {
  const allowed = ['Menunggu', 'Proses', 'Selesai', 'Ditolak'];
  if (!status) return 'Menunggu';
  return allowed.includes(status) ? status : 'Menunggu';
};

const buildPagination = (page = 1, limit = 10) => {
  const safePage = Number(page) > 0 ? Number(page) : 1;
  const safeLimit = Number(limit) > 0 && Number(limit) <= 100 ? Number(limit) : 10;
  const offset = (safePage - 1) * safeLimit;
  return { safePage, safeLimit, offset };
};

router.get('/', async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10, status } = req.query;
    const { safePage, safeLimit, offset } = buildPagination(page, limit);

    const filters = [];
    const params = [];

    if (q) {
      filters.push('(reference_no LIKE ? OR applicant_name LIKE ? OR service_type LIKE ?)');
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    if (status) {
      filters.push('status = ?');
      params.push(status);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const data = await query(
      `SELECT * FROM service_requests ${whereClause} ORDER BY submitted_at DESC LIMIT ? OFFSET ?`,
      [...params, safeLimit, offset]
    );

    const totalRows = await query(
      `SELECT COUNT(*) as count FROM service_requests ${whereClause}`,
      params
    );

    res.json({
      data,
      meta: {
        page: safePage,
        limit: safeLimit,
        total: totalRows[0]?.count || 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { reference_no, applicant_name, service_type, status, notes } = req.body;

    if (!reference_no || !applicant_name || !service_type) {
      return res.status(400).json({ message: 'reference_no, applicant_name, and service_type are required.' });
    }

    const normalizedStatus = mapStatus(status);

    const result = await query(
      `INSERT INTO service_requests (reference_no, applicant_name, service_type, status, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [reference_no, applicant_name, service_type, normalizedStatus, notes || null]
    );

    const inserted = await query('SELECT * FROM service_requests WHERE id = ?', [result.insertId]);
    res.status(201).json(inserted[0]);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reference_no, applicant_name, service_type, status, notes } = req.body;

    if (!reference_no || !applicant_name || !service_type) {
      return res.status(400).json({ message: 'reference_no, applicant_name, and service_type are required.' });
    }

    const normalizedStatus = mapStatus(status);

    await query(
      `UPDATE service_requests
       SET reference_no = ?, applicant_name = ?, service_type = ?, status = ?, notes = ?
       WHERE id = ?`,
      [reference_no, applicant_name, service_type, normalizedStatus, notes || null, id]
    );

    const updated = await query('SELECT * FROM service_requests WHERE id = ?', [id]);
    if (!updated[0]) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(updated[0]);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id FROM service_requests WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ message: 'Request not found' });
    }

    await query('DELETE FROM service_requests WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
