import supertest from 'supertest';
import app from '../../server';
import { UserStore } from '../../models/user';

const store = new UserStore();

let adminUserId: string;
let userId: string;
let authorizationToken: string;

describe('Endpoint /users', function () {
  // Login with new user and save authorizationToken to variable
  beforeAll(async function () {
    const result = await store.create({
      username: 'testuser',
      firstname: 'Johnny',
      lastname: 'English',
      password: 'testuser'
    });
    adminUserId = String(result.id);
    await supertest(app)
      .post('/users/authenticate')
      .set('Accept', 'application/json')
      .send({ username: 'testuser', password: 'testuser' })
      .then(function (res) {
        //console.log(`Authorization Token is ${res.body.AuthorizationToken}`)
        authorizationToken = res.body.AuthorizationToken;
      });
  });

  it('should create user and respond with Authorization Token', function (done) {
    supertest(app)
      .post('/users')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authorizationToken}`)
      .send({
        username: 'johnny',
        firstname: 'Johnny',
        lastname: 'English',
        password: 'Password123'
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          done.fail(err);
        } else {
          userId = res.body.id;
          done();
        }
      });
  });

  it('should authenticate user', function (done) {
    supertest(app)
      .post('/users/authenticate')
      .set('Accept', 'application/json')
      .send({ username: 'johnny', password: 'Password123' })
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

  it('should show all users', function (done) {
    supertest(app)
      .get('/users')
      .set('Authorization', `Bearer ${authorizationToken}`)
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

  it('should show user', function (done) {
    supertest(app)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${authorizationToken}`)
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

  it('should delete user', function (done) {
    supertest(app)
      .delete('/users')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authorizationToken}`)
      .send({ id: userId })
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
    const result = await store.delete(adminUserId);
  });
});
