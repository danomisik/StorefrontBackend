import express, { Request, Response } from 'express';
import { param, body, validationResult } from 'express-validator';
import { Product, ProductStore } from '../models/product';
import verifyAuthToken from '../services/verifyAuth';

const store = new ProductStore();

const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send("Products wasn't found");
  }
};

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    //input validation
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const product = await store.show(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send("Product wasn't found");
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    //input validation
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const product: Product = req.body;

    const newProduct = await store.create(product);
    res.json(newProduct);
  } catch (err) {
    res.status(500);
    res.send("Product wasn't added");
  }
};

const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    //input validation
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const deleted = await store.delete(req.body.id);
    res.send('Product was deleted');
  } catch (err) {
    res.status(500);
    res.send("Product wasn't deleted");
  }
};

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', param('id').exists().isInt(), show);
  app.post(
    '/products',
    body('name').exists().isString(),
    body('price').exists().isFloat(),
    body('url').exists().isString(),
    body('description').exists().isString(),
    verifyAuthToken,
    create
  );
  app.delete(
    '/products',
    body('id').exists().isInt(),
    verifyAuthToken,
    destroy
  );
};

export default productRoutes;
