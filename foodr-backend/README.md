# API Documentation

Note: parameters and queries with spaces need to be substituted with `%20`

## Product Info

### Endpoints

If not logged in:

`GET /products/[SEARCH TERM]`

If user is logged in, provide a user ID as a query so a `Search` object is created and associated with the user:

 `GET /products/[SEARCH TERM]?user_id=[USER ID HERE]`

Search term can be UPC code or exact name of product

### Output
If successful:

```
{
    "found": true,
    "product": {
        "id": 1,
        "upc": "03077504",
        "name": "Quaker Chewy Chocolate Chip Bar",
        "score": 3,
        "img_url": "https://images-na.ssl-images-amazon.com/images/I/81wqeA8l9CL._SL1500_.jpg",
        "created_at": "2017-07-30T22:56:12.139Z",
        "updated_at": "2017-07-30T22:56:12.139Z"
    },
    "ingredients": [
        {
            "id": 2,
            "name": "Tea Oil",
            "description": "this is unhealthy",
            "is_natural": false,
            "img_url": null,
            "created_at": "2017-07-30T22:56:12.207Z",
            "updated_at": "2017-07-30T22:56:12.207Z"
        },
        {
            "id": 3,
            "name": "Sultanas",
            "description": "this is healthy",
            "is_natural": true,
            "img_url": null,
            "created_at": "2017-07-30T22:56:12.209Z",
            "updated_at": "2017-07-30T22:56:12.209Z"
        },
        {
            "id": 6,
            "name": "Olives",
            "description": "this is unhealthy",
            "is_natural": false,
            "img_url": null,
            "created_at": "2017-07-30T22:56:12.214Z",
            "updated_at": "2017-07-30T22:56:12.214Z"
        }
    ],
    "search": null
}
```
If unsuccessful:
```
{
    "found": false
}
```

## Ingredient Info

### Endpoint

`GET /ingredients/[PRODUCT ID]`

### Output
If successful:
```
{
    "found": true,
    "ingredient": {
        "id": 1,
        "name": "Pumpkin Seed",
        "description": "this is healthy",
        "img_url": null,
        "created_at": "2017-07-29T02:12:28.909Z",
        "updated_at": "2017-07-29T02:12:28.909Z"
    }
}
```
If unsuccessful:
```
{
    "found": false
}
```

## User Profile

### Endpoint

`GET /users/[USER ID]`

### Output
If successful:
```
{
    "found": true,
    "user": {
        "id": 3,
        "email": "mohamed_lang@example.net",
        "password_digest": "$2a$10$agXQaoyU6swVtXApobwGwODc5ktcPISMZByBrZW9EAvJo/xugrvTK",
        "created_at": "2017-07-29T02:12:28.857Z",
        "updated_at": "2017-07-29T02:12:28.857Z"
    },
    "user_grade": "2.0",
    "searches": [
        {
            "id": 5,
            "product_id": 2,
            "user_id": 3,
            "is_saved": true,
            "created_at": "2017-07-29T02:12:28.896Z",
            "updated_at": "2017-07-29T02:12:28.896Z"
        },
        {
            "id": 8,
            "product_id": 1,
            "user_id": 3,
            "is_saved": false,
            "created_at": "2017-07-29T23:48:53.165Z",
            "updated_at": "2017-07-29T23:48:53.165Z"
        }
    ],
    "searched_products": [
        {
            "id": 1,
            "upc": "03077504",
            "name": "Quaker Chewy Chocolate Chip Bar",
            "score": 3,
            "img_url": "http://www.quakeroats.com/images/default-source/products/choc-chip_hero6c265c418cb46e438643ff2300547e50",
            "created_at": "2017-07-29T02:12:28.868Z",
            "updated_at": "2017-07-29T02:12:28.868Z"
        },
        {
            "id": 2,
            "upc": "40084510",
            "name": "Hanute Hazelnut Wafer",
            "score": 2,
            "img_url": "https://images-na.ssl-images-amazon.com/images/I/815%2BCzZIVxL._SX355_.jpg",
            "created_at": "2017-07-29T02:12:28.870Z",
            "updated_at": "2017-07-29T02:12:28.870Z"
        }
    ],
    "saved_products": [
        {
            "id": 2,
            "upc": "40084510",
            "name": "Hanute Hazelnut Wafer",
            "score": 2,
            "img_url": "https://images-na.ssl-images-amazon.com/images/I/815%2BCzZIVxL._SX355_.jpg",
            "created_at": "2017-07-29T02:12:28.870Z",
            "updated_at": "2017-07-29T02:12:28.870Z"
        }
    ]
}
```
If unsuccessful:
```
{
    "found": false
}
```

## Create User

### Endpoint

`POST /users?email=[EMAIL HERE]&password=[PASSWORD HERE]`

### Output
If successful:
```
{
    "saved": true,
    "user": {
        "id": 7,
        "email": "bleh@blah",
        "password_digest": "$2a$10$f69LEK3uY0tmwPnRhcwSWuRNPGT4bL2SMhg02nPO98Dii6Qb5Uguu",
        "created_at": "2017-07-30T00:10:16.423Z",
        "updated_at": "2017-07-30T00:10:16.423Z"
    }
}
```
If unsuccessful:
```
{
    "saved": false,
    "errors": [
        "Email has already been taken"
    ]
}
```

## Save a Product (aka Saving a Search)
### Endpoint
`POST searches/[SEARCH ID]/save`
### Output
If successful:
```
{
    "save_successful": true,
    "search": {
        "id": 4,
        "is_saved": true,
        "user_id": 2,
        "product_id": 1,
        "created_at": "2017-07-29T02:12:28.894Z",
        "updated_at": "2017-07-29T22:45:45.429Z"
    },
    "product": {
        "id": 1,
        "upc": "03077504",
        "name": "Quaker Chewy Chocolate Chip Bar",
        "score": 3,
        "img_url": "http://www.quakeroats.com/images/default-source/products/choc-chip_hero6c265c418cb46e438643ff2300547e50",
        "created_at": "2017-07-29T02:12:28.868Z",
        "updated_at": "2017-07-29T02:12:28.868Z"
    }
}
```
If unsuccessful:
```
{
    "save_successful": false
}
```
