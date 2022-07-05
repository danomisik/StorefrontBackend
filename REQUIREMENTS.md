# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
### Products
#### Index - get all products
 
 - Request
 
 URL: `'/products' [GET]`

 - Response body

```
[
    {
        "id": 1,
        "name": "Product1",
        "price": 12
    }
]
```

#### Show - get certain product

 - Request
 
 URL: `'/products/:id' [GET]`

 id: id of product

 - Response body

```
{
    "id": ${id},
    "name": "Product1",
    "price": 12
}
```


#### Create [token required] - create new product

- Request
 
 URL: `'/products' [POST]`
 
 Header: Authorization - Bearer ${AuthorizationToken}
 
 Body:

 ```
 {
    "name": "Product1",
    "price": "12.1"
 }
 ```

 - Response body

```
    {
        "id": 1,
        "name": "Product1",
        "price": 12.1
    }
```

#### Delete [ADDITIONAL] - delete product

 - Request
 
 URL: `'/products' [DELETE]`

 body:

 ```
 {
    "id": "${id}"
 }
 ```

id: id of product that should be deleted


 - Response body

```
Product was deleted
```

### Users

#### Index [token required] - get all users

- Request
 
 URL: `'/users' [GET]`
 
 Header: Authorization - Bearer ${AuthorizationToken}

 - Response body

```
[
    {
        "id": 7,
        "username": "username",
        "firstname": "Johnny",
        "lastname": "English",
        "password": "$2b$10$mb5/9pU7FqoS8bvZYoJD2eLe4anVrI9VY96BssF2j.pAjE.SrwS5e"
    }
]
```

#### Show [token required] - show specific user

- Request
 
 URL: `'/users/:id' [GET]`
 
 Header: Authorization - Bearer ${AuthorizationToken}
 
 id: id of user

 - Response body

```
    {
        "id": ${id},
        "username": "username",
        "firstname": "Johnny",
        "lastname": "English",
        "password": "$2b$10$mb5/9pU7FqoS8bvZYoJD2eLe4anVrI9VY96BssF2j.pAjE.SrwS5e"
    }
```

#### Create [token required] - create user

- Request
 
 URL: `'/users' [POST]`
 
 Header: Authorization - Bearer ${AuthorizationToken}
 
 Body:

```
{
    "username": "username",
    "firstname": "sd",
    "lastname": "zxcz",
    "password": "password"
}
```

 - Response body

```
    {
        "id": 1,
        "username": "username",
        "firstname": "sd",
        "lastname": "zxcz",
        "password": "$2b$10$mb5/9pU7FqoS8bvZYoJD2eLe4anVrI9VY96BssF2j.pAjE.SrwS5e"
    }
```

#### Authenticate [ADDITIONAL] - authneticate user

 - Request
 
 URL: `'/users/authenticate' [POST]`

 body:

 ```
 {
    "username": "username",
    "password": "password"
 }
 ```

 - Response body

```
{
    "AuthorizationToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJ1c2VybmFtZSI6InVzZXJuYW1lIn0sImlhdCI6MTY1NzAwNTE0NSwiZXhwIjoxNjU3MDkxNTQ1fQ.NX78kF8_CEjNlM8RGhRacKIAewS19wK_TANNLnt-mvE"
}
```

Note: this token can be used for [token required] requests, need to be revoke after 24 hours.


#### Delete [ADDITIONAL] - delete user

 - Request
 
 URL: `'/users' [DELETE]`

 body:

 ```
 {
    "id": "${id}"
 }
 ```

id: id of user that should be deleted

 - Response body

```
User was deleted
```

### Orders
#### Current Order by user (args: user id)[token required]

- Request
 
 URL: `'/orders/:user_id' [GET]`

 Header: Authorization - Bearer ${AuthorizationToken}

 user_id: id of user

 - Response body

```
{
    "id": 1,
    "status": "active",
    "user_id": "${user_id}",
    "products": [
        {
            "quantity": 10,
            "product_id": "6"
        }
    ]
}
```

#### Add product to order [ADDITIONAL] [token required]

- Request
 
 URL: `'/orders/products' [POST]`

 Header: Authorization - Bearer ${AuthorizationToken}

 Body:

```
{
    "quantity": "11",
    "order_id": "2",
    "product_id": "6"
}
```

 - Response body

```
{
    "id": 3,
    "quantity": 11,
    "order_id": "2",
    "product_id": "6"
}
```

## Data Shapes

Shapes that should be send between Frontend and Backend defined by Udacity Project.

#### Product
-  id
- name
- price
- [OPTIONAL] category

#### User
- id
- firstName
- lastName
- password

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

## Database tables

### Users

```
TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    firstName VARCHAR NOT NULL,
    lastName VARCHAR NOT NULL,
    password VARCHAR NOT NULL
)
```

### Products

```
TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    price FLOAT NOT NULL
)
```

### Orders

```
TABLE orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(15),
    user_id bigint REFERENCES users(id)
)
```

### OrderProducts

```
TABLE order_products (
    id SERIAL PRIMARY KEY,
    quantity integer,
    order_id bigint REFERENCES orders(id),
    product_id bigint REFERENCES products(id)
)
```