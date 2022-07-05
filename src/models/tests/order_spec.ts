import { ProductStore } from '../product';
import { OrderStore } from '../order';
import { UserStore } from '../user';
import client from '../../database';

const productStore = new ProductStore();
const store = new OrderStore();
const userStore = new UserStore();

let productId: string;
let userId: string;
let orderId: string;

describe('Order Model', () => {
  // Create prerequisites: user and 1 product
  beforeAll(async function () {
    const result = await userStore.create({
      username: 'testuser',
      firstname: 'Johnny',
      lastname: 'English',
      password: 'testuser'
    });
    userId = String(result.id);
    const result1 = await productStore.create({
      name: 'Jo Nesbo: Macbeth',
      price: 15
    });
    productId = String(result1.id);
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a add product method', () => {
    expect(store.addProduct).toBeDefined();
  });

  it('show method should return empty order', async () => {
    const result = await store.show(userId);
    expect(result.status).toEqual('active');
    expect(String(result.user_id)).toEqual(userId);
    expect(result.products).toEqual([]);
    orderId = String(result.id);
  });

  it('add product method should add product to order', async () => {
    const result = await store.addProduct(10, orderId, productId);
    expect(result.quantity).toEqual(10);
    expect(String(result.product_id)).toEqual(productId);
    expect(String(result.order_id)).toEqual(orderId);
  });

  it('show method should return order with 1 product', async () => {
    const result = await store.show(userId);
    expect(result.status).toEqual('active');
    expect(String(result.user_id)).toEqual(userId);
    expect(result.products[0].quantity).toEqual(10);
    expect(String(result.products[0].product_id)).toEqual(productId);
    orderId = String(result.id);
  });

  // Remove all prerequistes
  afterAll(async function () {
    //TODO add delete method for Order and OrderProduct
    const conn = await client.connect();
    // remove order
    let sql = 'DELETE FROM order_products';
    await conn.query(sql);
    // remove order
    sql = 'DELETE FROM orders WHERE id=($1)';
    await conn.query(sql, [orderId]);
    conn.release();
    const result = await userStore.delete(userId);
    const result1 = await productStore.delete(productId);
  });
});
