import * as express from 'express';
import * as ajv from 'ajv';
import * as path from 'path';

import { Order } from '../../interfaces/order';

const router = express.Router();

const orderSchema = require(path.join(__dirname, '../../schemas/order.json'));

const jsonSchemaValidator = ajv({
  // perform in-place conversion of strings that represent numbers and booleans
  // to the JS primitive types
  coerceTypes: true
});
jsonSchemaValidator.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
const validateNewOrder = jsonSchemaValidator.compile(orderSchema);

router.post('/new', async function (req, res, next) {
  const order = req.body as Order;
  if (validateNewOrder(order)) {
    const [result, fields] = await res.locals.dbConnection.execute(
      'INSERT INTO `orders` (`currency`, `quantity`) VALUES (?, ?)',
      [order.currency, order.quantity]
    );
    res.json({ id: result.insertId });
  } else {
    const errors = (validateNewOrder.errors || []).map(err => err.message);
    res.json({ validationErrors: errors });
  }
});

export default router;
