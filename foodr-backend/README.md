# API Documentation

## Search Info

### Endpoints
`GET /searches/[SEARCH ID]`
### Output
If successful:
```
{
    "found": true,
    "product": {
        "id": 1,
        "upc": "0",
        "name": "Tiramisù",
        "score": 4,
        "img_url": "https://unsplash.it/300/200",
        "created_at": "2017-08-02T01:44:06.358Z",
        "updated_at": "2017-08-02T01:44:06.358Z"
    },
    "ingredients": [
        {
            "id": 1,
            "name": "Sun dried tomatoes",
            "description": "Et eaque fuga in voluptatibus. Necessitatibus incidunt qui. Est tempore aut non dolores explicabo.",
            "is_natural": false,
            "img_url": "https://unsplash.it/400/200",
            "created_at": "2017-08-02T01:44:06.379Z",
            "updated_at": "2017-08-02T01:44:06.379Z"
        },
        {
            "id": 2,
            "name": "Melon",
            "description": "Harum rem voluptatem corrupti doloribus. Eaque earum dolores harum. Sint et molestiae facilis autem aperiam.",
            "is_natural": false,
            "img_url": "https://unsplash.it/200/400",
            "created_at": "2017-08-02T01:44:06.396Z",
            "updated_at": "2017-08-02T01:44:06.396Z"
        },
        {
            "id": 3,
            "name": "Bread",
            "description": "Nisi reprehenderit recusandae porro atque qui. Corporis doloremque repudiandae quis enim. Quo vel maxime sit similique tempora. Consequatur aliquid tempora nesciunt ut ipsa qui ipsam.",
            "is_natural": false,
            "img_url": "https://unsplash.it/200/400",
            "created_at": "2017-08-02T01:44:06.400Z",
            "updated_at": "2017-08-02T01:44:06.400Z"
        }
    ],
    "search": {
        "id": 1,
        "product_id": 1,
        "user_id": 1,
        "is_saved": true,
        "created_at": "2017-08-02T01:44:06.416Z",
        "updated_at": "2017-08-02T01:44:06.416Z"
    }
}
```
If unsuccessful:
```
{
    "found": false
}
```
## Product Info by UPC

### Endpoints

If not logged in:

`GET /products/upc/[SEARCH UPC]`

If user is logged in, provide a user ID as a query so a `Search` object is created and associated with the user:

 `GET /products/upc/[SEARCH UPC]?user_id=[USER ID HERE]`

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

## Product Info by Name

### Endpoints

If not logged in:

`GET /products/name/[SEARCH TERM]`

If user is logged in, provide a user ID as a query so a `Search` object is created and associated with the user:

 `GET /products/name/[SEARCH TERM]?user_id=[USER ID HERE]`

Search term can be UPC code or exact name of product

### Output
If a single match found: Same output as search by UPC

If multiple possible matches found:
```
{
    "matches": [
        {
            "id": 8,
            "name": "Quaker Chewy Chocolate Chip Bar",
            "upc": "03077504"
        },
        {
            "id": 9,
            "name": "Quaker Chewy Chocolate Chip Bar",
            "upc": "03077504"
        }
    ]
}
```
If no matches found:
```
{
    "found": false,
    "matches": []
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

`GET /users/profile/[USER ID]`

### Output
If successful:
```
{
    "found": true,
    "user": {
        "id": 1,
        "email": "user@email.com",
        "password_digest": "$2a$10$4/QFoG82Qvzb2xlV9Wq3H.OX/6wsWBI5emCwB3L7iIya3dnHITzjm",
        "created_at": "2017-08-02T01:44:05.720Z",
        "updated_at": "2017-08-02T01:44:05.720Z"
    },
    "user_grade": "4.0",
    "searched_products": [
        {
            "id": 5,
            "product_id": 5,
            "user_id": 1,
            "is_saved": false,
            "created_at": "2017-08-02T01:44:06.476Z",
            "updated_at": "2017-08-02T01:44:06.476Z",
            "product_name": "Tuna sashimi",
            "img_url": "https://unsplash.it/300/400"
        },
        {
            "id": 4,
            "product_id": 4,
            "user_id": 1,
            "is_saved": true,
            "created_at": "2017-08-02T01:44:06.461Z",
            "updated_at": "2017-08-02T01:44:06.461Z",
            "product_name": "Caprese Salad",
            "img_url": "https://unsplash.it/300/400"
        },
        {
            "id": 3,
            "product_id": 3,
            "user_id": 1,
            "is_saved": false,
            "created_at": "2017-08-02T01:44:06.446Z",
            "updated_at": "2017-08-02T01:44:06.446Z",
            "product_name": "Chicken milanese",
            "img_url": "https://unsplash.it/300/300"
        }
    ],
    "saved_products": [
        {
            "id": 1,
            "product_id": 1,
            "user_id": 1,
            "is_saved": true,
            "created_at": "2017-08-02T01:44:06.416Z",
            "updated_at": "2017-08-02T01:44:06.416Z",
            "product_name": "Tiramisù",
            "img_url": "https://unsplash.it/300/200"
        },
        {
            "id": 2,
            "product_id": 2,
            "user_id": 1,
            "is_saved": true,
            "created_at": "2017-08-02T01:44:06.432Z",
            "updated_at": "2017-08-02T01:44:06.432Z",
            "product_name": "Chicken Fajitas",
            "img_url": "https://unsplash.it/400/200"
        },
        {
            "id": 4,
            "product_id": 4,
            "user_id": 1,
            "is_saved": true,
            "created_at": "2017-08-02T01:44:06.461Z",
            "updated_at": "2017-08-02T01:44:06.461Z",
            "product_name": "Caprese Salad",
            "img_url": "https://unsplash.it/300/400"
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
