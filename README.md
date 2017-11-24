# node-queries

Node.js library for building SQL queries and HTTP responses using SQL-like DSL.

## Installation

```sh
$ npm install node-queries
```

## Usage

Import `node-queries` module:

```javascript
import nodeQueries from 'node-queries';
```

Initialize database connection:

```javascript
nodeQueries.init({
  "host":     "db.example.com",
  "user":     "user",
  "password": "P4ssw0rd!",
  "database": "example"
});
```

Add middleware to your HTTP server:

```javascript
let app = express();
app.use(nodeQueries.middleware);
```

That's it. You can use queries in your controllers now:

```javascript
let router = express.Router();
app.use(router);
router.get('/items', function(request, response) {
  nodeQueries
    .selectFrom('item')
    .where({
      'visible': 1
    })
    .whereLike({
      'name': request.params.q
    })
    .orderBy('time_added', 'DESC')
    .limitOffset(request.params.limit, request.params.offset)
    .postprocess(item => {
      item.code = item.code.toUpperCase();
      delete item.visible;
    })
    .execute(response);
};
```
