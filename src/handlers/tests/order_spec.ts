import supertest from 'supertest';
import app from '../../server';
import { ProductStore } from '../../models/product';
import { UserStore } from '../../models/user';
import client from '../../database';

const productStore = new ProductStore();
const userStore = new UserStore();

let productId: string;
let authorizationToken: string;
let userId: string;
let orderId: string;

describe('Endpoint /orders', function () {
  // Login with new user and save authorizationToken to variable
  beforeAll(async function () {
    const result = await userStore.create({
      username: 'testproduct',
      firstname: 'Johnny',
      lastname: 'English',
      password: 'testproduct'
    });
    userId = String(result.id);
    await supertest(app)
      .post('/users/authenticate')
      .set('Accept', 'application/json')
      .send({ username: 'testproduct', password: 'testproduct' })
      .then(function (res) {
        //console.log(`Authorization Token is ${res.body.AuthorizationToken}`)
        authorizationToken = res.body.AuthorizationToken;
      });
    const result1 = await productStore.create({
      name: 'Jo Nesbo: Macbeth',
      price: 15,
      url: 'http:test.com/img.png',
      description: 'Great book'
    });
    productId = String(result1.id);
  });

  it('should show empty order', function (done) {
    supertest(app)
      .get(`/orders/${userId}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authorizationToken}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          done.fail(err);
        } else {
          orderId = res.body.id;
          done();
        }
      });
  });

  it('should add product', function (done) {
    supertest(app)
      .post('/orders/products')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authorizationToken}`)
      .send({
        quantity: '10',
        order_id: `${orderId}`,
        product_id: `${productId}`
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          done.fail(err);
        } else {
          done();
        }
      });
  });

  it('should show filled order', function (done) {
    supertest(app)
      .get(`/orders/${userId}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authorizationToken}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          done.fail(err);
        } else {
          orderId = res.body.id;
          done();
        }
      });
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
