import express, { Request, Response } from 'express';
import type { ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';
import users_routes from './handlers/users';
import products_routes from './handlers/products';
import orders_routes from './handlers/orders';
import cors from 'cors';

const app: express.Application = express();
const address = '0.0.0.0:3000';

app.use(bodyParser.json());

// Default error handler
// err is type of any because we don't know what will be thrown by environment
const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response
) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

// CORS enabled
const corsOptions = {
  origin: 'http://localhost',
  optionSuccessStatus: 200
};

app.use(errorHandler);
app.use(cors(corsOptions));

products_routes(app);
users_routes(app);
orders_routes(app);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
