import express, { Request, Response } from 'express';
import { param, body, validationResult } from 'express-validator';
import { OrderStore } from '../models/order';
import verifyAuthToken from '../services/verifyAuth';

const store = new OrderStore();

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    //input validation
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const order = await store.show(req.params.user_id);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send("Order wasn't found");
  }
};

const addProduct = async (req: Request, res: Response): Promise<void> => {
  //TODO: what if order does not exist.

  try {
    //input validation
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const newProductInOrder = await store.addProduct(
      req.body.quantity,
      req.body.order_id,
      req.body.product_id
    );
    res.json(newProductInOrder);
  } catch (err) {
    res.status(500);
    res.send("Product wasn't added to order");
  }
};

const orderRoutes = (app: express.Application) => {
  app.get('/orders/:user_id', param('user_id').exists().isInt(), show);
  app.post(
    '/orders/products',
    body('quantity').exists().isInt(),
    body('order_id').exists().isInt(),
    body('product_id').exists().isInt(),
    verifyAuthToken,
    addProduct
  );
};

export default orderRoutes;
