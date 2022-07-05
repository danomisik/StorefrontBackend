import client from '../database';

export type OrderProduct = {
  id?: number;
  quantity: number;
  product_id: number;
  order_id?: number;
};

export type Order = {
  id?: number;
  status: string;
  user_id: number;
  products: [OrderProduct];
};

export class OrderStore {
  async show(userId: string): Promise<Order> {
    try {
      let sql = "SELECT * FROM orders WHERE user_id=($1) AND status=('active')";
      const conn = await client.connect();
      let result = await conn.query(sql, [userId]);
      let order = result.rows[0];
      //if there is no active order create one
      if (order == null) {
        sql = 'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
        result = await conn.query(sql, ['active', userId]);
        let order = result.rows[0];
        order.products = [];
        conn.release();
        return order;
      } else {
        // find all products for order
        let sql = 'SELECT * FROM order_products WHERE order_id=($1)';
        result = await conn.query(sql, [order.id]);

        let order_products = result.rows;
        // delete OrderProduct id
        order_products.forEach(function (v: OrderProduct) {
          delete v.id;
          delete v.order_id;
        });
        order.products = order_products;
        conn.release();
        return order;
      }
    } catch (err) {
      throw new Error(`Could not show order for ${userId} : ${err}`);
    }
  }

  async addProduct(
    quantity: number,
    orderId: string,
    productId: string
  ): Promise<OrderProduct> {
    // get order to see if it is active
    try {
      const ordersql = 'SELECT * FROM orders WHERE id=($1)';

      const conn = await client.connect();

      const result = await conn.query(ordersql, [orderId]);

      const order = result.rows[0];

      if (order.status !== 'active') {
        throw new Error(
          `Could not add product ${productId} to order ${orderId} because order status is ${order.status}`
        );
      }

      conn.release();
    } catch (err) {
      throw new Error(`${err}`);
    }

    try {
      const sql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';

      const conn = await client.connect();

      const result = await conn.query(sql, [quantity, orderId, productId]);

      const order_product = result.rows[0];

      conn.release();

      return order_product;
    } catch (err) {
      throw new Error(
        `Could not add product ${productId} to order ${orderId}: ${err}`
      );
    }
  }
}
