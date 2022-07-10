CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    price FLOAT NOT NULL,
    url VARCHAR NOT NULL,
    description VARCHAR NOT NULL
);