import { string } from '@altostra/type-validations/lib/primitives';
import client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  url: string;
  description: string
};

export class ProductStore {
  async index(): Promise<Product[]> {
    const conn = await client.connect();
    const sql = 'SELECT * FROM products';
    const result = await conn.query(sql);
    conn.release();
    return result.rows;
  }

  async show(id: string): Promise<Product> {
    const sql = 'SELECT * FROM products WHERE id=($1)';
    const conn = await client.connect();
    const result = await conn.query(sql, [id]);
    conn.release();
    return result.rows[0];
  }

  async create(p: Product): Promise<Product> {
    const sql = 'INSERT INTO products (name, price, url, description) VALUES($1, $2, $3, $4) RETURNING *';
    const conn = await client.connect();
    const result = await conn.query(sql, [p.name, p.price, p.url, p.description]);
    const product = result.rows[0];
    conn.release();
    return product;
  }

  async delete(id: string): Promise<Product> {
    const sql = 'DELETE FROM products WHERE id=($1)';
    const conn = await client.connect();
    const result = await conn.query(sql, [id]);
    const product = result.rows[0];
    conn.release();
    return product;
  }
}
