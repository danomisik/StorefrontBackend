# Storefront Backend Project

This project contain example backend for store with users, orders and products that can be sold in store.

## Getting Started

This repo contains a basic Node and Express app to get you started in constructing an API. To get started, clone this repo and run `npm install` in your terminal at the project root.

## How to start database

1. Install Docker

2. Run following commands in command line:

```
docker run --name postgresql-container -p 5432:5432 -e POSTGRES_USER=daniel -e POSTGRES_PASSWORD=password123 -e POSTGRES_DB=store -d postgres
```

3. Database is running on localhost and port `5432`.

## How to run tests

1. Make sure that database is running
2. Run following commands in root directory of project:

```
npm run test
```

## How to format code

1. Run following commands in root directory of project:

```
npm run lint
npm run prettier
```

## How to deploy and use dev environment

1. Make sure that database is running

2. Run following commands in root directory of project:

```
db-migrate up
npm run watch
```

3. App is running on localhost and port `3000`.

4. Login to database and insert first user(Example: username=username, password=bcrypt(password)):

```
psql -h 127.0.0.1 -p 5432 -U daniel postgres
type password: password123
\c store
INSERT INTO users (username, firstname, lastname, password) VALUES('username', 'Johnny', 'English', '$2b$10$mb5/9pU7FqoS8bvZYoJD2eLe4anVrI9VY96BssF2j.pAjE.SrwS5e') RETURNING *;
```

5. Use Postman/Frontend:
- authenticate to `/users/authenticate [POST]` endpoint with json body
```
{
    "username": "username",
    "password": "password"
}
```
- Response will contain AuthorizationToken
- use AuthorizationToken for requests that have [token required]

## Additional details

.env file(only for review):

```
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=store
POSTGRES_USER=daniel
POSTGRES_PASSWORD=password123
ENV=dev
BCRYPT_PASSWORD=bookstore-password123
SALT_ROUNDS=10
TOKEN_SECRET=f1c640c7bd072fba35d83b885559e01b1d46f31e668c9171f3d0ae6a86ea8293
```

Details about Data Shapes, Tables in database and API Endpoints can be found in `REQUIREMENTS.md`.