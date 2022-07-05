import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader == null) {
      res.status(401);
      res.json('Authorization header is missing');
      return;
    }
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
    //TODO: add alg and id verification step
    //if(decoded.id !== user.id) {
    //    throw new Error('User id does not match!')
    //}
    next();
  } catch (error) {
    res.status(401);
    res.json('Access denied, invalid token');
  }
};

export default verifyAuthToken;
