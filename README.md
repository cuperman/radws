# AWS CRUD

## Rails Reference

### Routes

HTML format:

```
GET     /photos           photos#index
GET     /photos/new       photos#new
POST    /photos           photos#create
GET     /photos/:id       photos#show
GET     /photos/:id/edit  photos#edit
PUT     /photos/:id       photos#update
PATCH   /photos/:id       photos#update
DELETE  /photos/:id       photos#destroy
```

JSON format:

```
GET     /photos           photos#index
POST    /photos           photos#create
GET     /photos/:id       photos#show
PUT     /photos/:id       photos#update
PATCH   /photos/:id       photos#update
DELETE  /photos/:id       photos#destroy
```

### HTTP Response Codes

```
photos#index    200 OK
                304 Not Modified
photos#create   201 Created
                422 Unprocessable Entity (CSRF or invalid)
photos#show     200 OK
                304 Not Modified
                404 Not Found
photos#update   200 OK
                404 Not Found
                422 Unprocessable Entity (CSRF or invalid)
photos#destroy  204 No Content
                404 Not Found
                422 Unprocessable Entity (CSRF)
```

### Request Data

```
photos#create   { photo: { ...attributes } }
photos#update   { photo: { ...attributes } }
photos#destroy  empty
```

### Response Data

```
photos#index    [{ id, ...attributes, created_at, updated_at, url }, ...]
photos#create   { id, ...attributes, created_at, updated_at, url }
photos#show     { id, ...attributes, created_at, updated_at, url }
photos#update   { id, ...attributes, created_at, updated_at, url }
photos#destroy  empty
```

