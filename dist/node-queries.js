"use strict";
const factory_1 = require("./classes/factory");
const db_1 = require("./db");
const middleware_1 = require("./middleware");
exports = module.exports = function (response) {
    return new factory_1.default(response);
};
exports['middleware'] = middleware_1.default;
exports['init'] = function (options) {
    db_1.default.init(options);
};
//# sourceMappingURL=node-queries.js.map