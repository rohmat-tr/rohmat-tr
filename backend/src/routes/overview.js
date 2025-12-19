import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const total = await query('SELECT COUNT(*) as count FROM service_requests');
    const waiting = await query(
      'SELECT COUNT(*) as count FROM service_requests WHERE status = ?',[ 'Menunggu' ]
    );
    const inProgress = await query(
      'SELECT COUNT(*) as count FROM service_requests WHERE status = ?', [ 'Proses' ]
    );
    const finished = await query(
      'SELECT COUNT(*) as count FROM service_requests WHERE status = ?', [ 'Selesai' ]
    );

    res.json({
      total: total[0]?.count || 0,
      waiting: waiting[0]?.count || 0,
      inProgress: inProgress[0]?.count || 0,
      finished: finished[0]?.count || 0,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
