import express, { NextFunction, Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { param, body, validationResult } from 'express-validator';
import verifyAuthToken from '../services/verifyAuth';

dotenv.config();

const store = new UserStore();

const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const user = await store.index();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send("Users wasn't found");
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
    const user = await store.show(req.params.id);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send("User wasn't found");
  }
};

const create = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    const user: User = req.body;
    //input validation
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const newUser = await store.create(user);
    res.json(newUser);
  } catch (err) {
    // @ts-ignore
    // verify if there is 'duplicate key violates unique constraint' for username <https://bobcares.com/blog/postgresql-error-code-23505/>
    if (err.code == '23505') {
      // @ts-ignore
      console.log(err.detail);
      res.status(422);
      res.send('Username is taken');
    } else {
      console.error(err);
      res.status(500);
      res.send("User wasn't created");
    }
  }
};

const authenticate = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    //input validation
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const user = await store.authenticate(req.body.username, req.body.password);
    if (user == null) {
      res.status(401);
      res.send('Username or password is wrong');
      return;
    }
    var token = jwt.sign(
      { user: { id: user.id, username: user.username } },
      process.env.TOKEN_SECRET as string,
      { expiresIn: '24h' }
    );
    res.json({ AuthorizationToken: token });
  } catch (error) {
    console.error(error);
    res.status(401);
    res.send("User wasn't authenticated");
  }
};

const destroy = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    //input validation
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const deleted = await store.delete(req.body.id);
    res.send('User  was deleted');
  } catch (error) {
    console.error(error);
    res.status(401);
    res.send("User wasn't deleted");
  }
};

const userRoutes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index);
  app.post(
    '/users',
    body('username').exists().notEmpty().isString(),
    body('firstname').exists().notEmpty().isString(),
    body('lastname').exists().notEmpty().isString(),
    body('password').exists().notEmpty().isString(),
    verifyAuthToken,
    create
  );
  app.delete(
    '/users',
    body('id').exists().notEmpty().isNumeric(),
    verifyAuthToken,
    destroy
  );
  app.post(
    '/users/authenticate',
    body('username').exists().notEmpty().isString(),
    body('password').exists().notEmpty().isString(),
    authenticate
  );
  app.get('/users/:id', param('id').exists().isInt(), verifyAuthToken, show);
};

export default userRoutes;
