"use strict";
const select_1 = require("./builders/select");
const select_count_1 = require("./builders/select-count");
const select_one_1 = require("./builders/select-one");
const insert_1 = require("./builders/insert");
const update_1 = require("./builders/update");
const delete_1 = require("./builders/delete");
class Factory {
    selectFrom(table) {
        return new select_1.default(table);
    }
    selectCountFrom(table) {
        return new select_count_1.default(table);
    }
    selectOneFrom(table) {
        return new select_one_1.default(table);
    }
    insertInto(table) {
        return new insert_1.default(table);
    }
    update(table) {
        return new update_1.default(table);
    }
    deleteFrom(table) {
        return new delete_1.default(table);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Factory;
//# sourceMappingURL=factory.js.map