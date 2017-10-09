import * as express from 'express';
import * as path from 'path';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../../schemas/order.json'));
});

export default router;
