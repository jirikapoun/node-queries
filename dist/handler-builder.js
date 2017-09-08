"use strict";
const select_1 = require("./handlers/select");
const select_count_1 = require("./handlers/select-count");
const select_one_1 = require("./handlers/select-one");
const insert_1 = require("./handlers/insert");
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
    insertInto(table) {
        return new insert_1.default(this.response, table);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HandlerBuilder;
//# sourceMappingURL=handler-builder.js.map