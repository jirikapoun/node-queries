"use strict";
const factory_1 = require("./classes/factory");
const middleware_1 = require("./middleware");
exports = module.exports = function (connection) {
    return new factory_1.default(connection);
};
exports['middleware'] = middleware_1.default;
//# sourceMappingURL=node-queries.js.map