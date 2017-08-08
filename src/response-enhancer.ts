export default function responseEnhancer(request, response, next) {
  
  response.ok = function (data, contentType) {
    response.statusCode = 200;
    if (contentType)
      response.setHeader('Content-Type', contentType);
    if (data)
      response.write(data);
    response.end();
  };
  
  response.created = function (location) {
    response.statusCode = 201;
    if (location)
      response.setHeader('Location', request.swagger.swaggerObject.basePath || '' + location);
    response.end();
  };
  
  response.noContent = function () {
    response.statusCode = 204;
    response.end();
  };
  
  response.badRequest = function () {
    response.statusCode = 400;
    response.end();
  };
  
  response.unauthorized = function (message) {
    response.statusCode = 401;
    response.end(message);
  };
  
  response.forbidden = function () {
    response.statusCode = 403;
    response.end();
  };
  
  response.notFound = function () {
    response.statusCode = 404;
    response.end();
  };
  
  response.internalServerError = function () {
    response.statusCode = 500;
    response.end();
  };
  
  response.handlers = {
    
    returnRecord: function (record) {
      var json = JSON.stringify(record);
      response.ok(json, 'application/json; charset=utf-8');
    },
    
    returnFirstRecord: function (records) {
      if (records.length > 0) {
        var json = JSON.stringify(records[0]);
        response.ok(json, 'application/json; charset=utf-8');
      } else {
        response.notFound();
      }
    },

    returnRecords: function (records) {
      if (records.length > 0) {
        var json = JSON.stringify(records);
        response.ok(json, 'application/json; charset=utf-8');
      } else {
        response.noContent();
      }
    }
    
  };
  
  response.createInsertHandler = function (location) {
    return function (result) {
      if (location)
        response.created(location + '/' + result.insertId);
      else
        response.created();
    };
  };
  
  response.createUpdateHandler = function () {
    return function (result) {
      if (result.affectedRows === 0)
        response.notFound();
      else
        response.noContent();
    };
  };
  
  response.createDeleteHandler = function () {
    return this.createUpdateHandler();
  };
  
  next();
  
};