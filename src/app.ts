import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
const mysql = require('mysql2/promise');

import orders from './routes/orders';
import schemas from './routes/schemas';

export interface IServerError extends Error {
  syscall?: string;
  code?: string;
  status?: number;
}

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// serve the pre-built React app
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.use(async function (req, res, next) {
  res.locals.dbConnection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bitcoin-mockup'
  });
  next();
});
app.use('/api/orders', orders);
app.use('/api/schemas', schemas);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found') as IServerError;
  err.status = 404;
  next(err);
});

// error handler
app.use((err: IServerError, req: express.Request, res: express.Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).end();
});

export default app;
