# Storefront Backend Project

This project contain example backend for store with users, orders and products that can be sold in store.

## Getting Started

This repo contains a basic Node and Express app to get you started in constructing an API. To get started, clone this repo and run `npm install` in your terminal at the project root.

## Deploy Postgres databases

1. Install Docker

2.  Start postgres container with `store` database for developemnt:

```
docker run --name postgresql-container -p 5432:5432 -e POSTGRES_USER=daniel -e POSTGRES_PASSWORD=password123 -e POSTGRES_DB=store -d postgres
```

DEV Database details:

- Database name: store ( same as value of [POSTGRES_DB environment variable](#additional-details))
- Port: 5432 ( same as value of [POSTGRES_PORT environment variable](#additional-details) )
- username of database user: daniel
- password of database user: password123

3.  Start postgres container with `store_test` database for testing:

```
docker run --name postgresql-test-container -p 5433:5432 -e POSTGRES_USER=daniel -e POSTGRES_PASSWORD=password123 -e POSTGRES_DB=store_test -d postgres
```

TEST Database details:

- Database name: store_test ( same as value of [POSTGRES_TEST_DB environment variable](#additional-details))
- Port: 5433 ( same as value of [POSTGRES_TEST_PORT environment variable](#additional-details) )
- username of database user: daniel
- password of database user: password123


## How to use psql for access to databases

Access DEV database:

1. Run following command in command line to access DEV postgres deployment:

```
psql -h 127.0.0.1 -p 5432 -U daniel postgres
```

2. Type password `password123` to login as user daniel

3. Run following command to access `store` database

```
\c store
```

4. Now you can write INSERTS, SELECTS, UPDATES in `store` database


Access TEST database:

1. Run following command in command line to access TEST postgres deployment:

```
psql -h 127.0.0.1 -p 5433 -U daniel postgres
```

2. Type password `password123` to login as user daniel

3. Run following command to access `store_test` database

```
\c store_test
```

4. Now you can write INSERTS, SELECTS, UPDATES in `store_test` database

## How to start tests

1. [Deploy TEST database](#Deploy Postgres databases)
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

## How to deploy DEV application

1. [Deploy DEV database](#Deploy Postgres databases)

2. Migrate database tables for DEV by following command in root directory of project :

```
db-migrate up
```

3. Start app by following command in root directory of project:

```
npm run watch
```

4. App is running on localhost and port `3000`.

5. Use Postman or curl or frontend to work with Backend:

- create user through `/users [POST]` API endpoint or
- authenticate to existing user by `/users/authenticate [POST]` API endpoint with json body
```
{
    "username": "username",
    "password": "password"
}
```
- Response will contain AuthorizationToken
- Use AuthorizationToken for API requests that have [token required]

## Additional details

.env file(only for review):

```
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=store
POSTGRES_TEST_DB=store_test
POSTGRES_USER=daniel
POSTGRES_PASSWORD=password123
POSTGRES_PORT=5432
POSTGRES_TEST_PORT=5433
ENV=dev
BCRYPT_PASSWORD=bookstore-password123
SALT_ROUNDS=10
TOKEN_SECRET=f1c640c7bd072fba35d83b885559e01b1d46f31e668c9171f3d0ae6a86ea8293
```

Details about Data Shapes, Tables in database and API Endpoints can be found in `REQUIREMENTS.md`.