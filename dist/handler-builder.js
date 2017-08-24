"use strict";
const select_1 = require("./handlers/select");
const select_count_1 = require("./handlers/select-count");
const select_one_1 = require("./handlers/select-one");
const custom_query_1 = require("./handlers/custom-query");
class HandlerBuilder {
    constructor(response) {
        this.response = response;
    }
    selectFrom(table) {
        return new select_1.default(this.response, table);
    }
    selectCountFrom(table) {
        return new select_count_1.default(this.response, table);
    }
    selectOneFrom(table) {
        return new select_one_1.default(this.response, table);
    }
    customQuery(sql) {
        return new custom_query_1.default(this.response, sql);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HandlerBuilder;
//# sourceMappingURL=handler-builder.js.map