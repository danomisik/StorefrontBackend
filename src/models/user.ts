import bcrypt from 'bcrypt';
import client from '../database';

import dotenv from 'dotenv';

dotenv.config();

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export type User = {
  id?: number;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    const conn = await client.connect();
    const sql = 'SELECT * FROM users';
    const result = await conn.query(sql);
    conn.release();
    return result.rows;
  }

  async show(id: string): Promise<User> {
    const sql = 'SELECT * FROM users WHERE id=($1)';
    const conn = await client.connect();
    const result = await conn.query(sql, [id]);
    conn.release();
    return result.rows[0];
  }

  async create(u: User): Promise<User> {
    const conn = await client.connect();
    const sql =
      'INSERT INTO users (username, firstname, lastname, password) VALUES($1, $2, $3, $4) RETURNING *';

    const hash = bcrypt.hashSync(
      u.password + BCRYPT_PASSWORD,
      parseInt(SALT_ROUNDS as string)
    );
    const result = await conn.query(sql, [
      u.username,
      u.firstname,
      u.lastname,
      hash
    ]);
    const user = result.rows[0];
    conn.release();
    return user;
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    const conn = await client.connect();
    const sql = 'SELECT * FROM users WHERE username=($1)';

    const result = await conn.query(sql, [username]);

    if (result.rows.length) {
      const user = result.rows[0];

      if (bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password)) {
        return user;
      }
    }

    return null;
  }

  async delete(id: string): Promise<User> {
    const sql = 'DELETE FROM users WHERE id=($1)';
    const conn = await client.connect();
    const result = await conn.query(sql, [id]);
    const user = result.rows[0];
    conn.release();
    return user;
  }
}

export default UserStore;
