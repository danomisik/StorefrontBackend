import supertest from 'supertest';
import app from '../../server';
import { UserStore } from '../../models/user';

const store = new UserStore();

let productId: string;
let authorizationToken: string;
let userId: string;

describe('Endpoint /products', function () {
  // Login with new user and save authorizationToken to variable
  beforeAll(async function () {
    const result = await store.create({
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
  });

  it('should create product', function (done) {
    supertest(app)
      .post('/products')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authorizationToken}`)
      .send({
        name: 'Pecat mysle',
        price: '12.1',
        url: 'http:test.com/img.png',
        description: 'Great book'
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          done.fail(err);
        } else {
          productId = res.body.id;
          done();
        }
      });
  });

  it('should show all products', function (done) {
    supertest(app)
      .get('/products')
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

  it('should show product', function (done) {
    supertest(app)
      .get(`/products/${productId}`)
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

  it('should delete product', function (done) {
    supertest(app)
      .delete('/products')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authorizationToken}`)
      .send({
        id: productId
      })
      .expect(200)
      .end(function (err, res) {
        if (err) {
          done.fail(err);
        } else {
          done();
        }
      });
  });

  // Remove user
  afterAll(async function () {
    const result = await store.delete(String(userId));
  });
});
