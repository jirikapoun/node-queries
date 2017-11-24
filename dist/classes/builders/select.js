"use strict";
const mysql = require("mysql2");
const abstract_1 = require("./abstract");
class SelectBuilder extends abstract_1.default {
    constructor(table) {
        let statement = mysql.format('SELECT ??.* FROM ??', [table, table]);
        super(statement, table);
    }
    joinUsing(joinTable, using) {
        return this.createJoinUsingStatement(joinTable, using);
    }
    joinOn(joinTable, firstKey, secondKey) {
        return this.createJoinOnStatement(joinTable, firstKey, secondKey);
    }
    where(criteria) {
        return this.createWhereStatement(criteria);
    }
    whereAny(criteria) {
        return this.createWhereStatement(criteria, true);
    }
    whereIfNotEmpty(criteria) {
        return this.createWhereStatement(criteria, false, true);
    }
    whereLike(criteria) {
        return this.createWhereLikeStatement(criteria, false);
    }
    orderBy(column, ascOrDesc) {
        return this.createOrderByStatement(column, ascOrDesc);
    }
    limitOffset(limit, offset) {
        return this.setLimitOffset(limit, offset);
    }
    postprocess(callback) {
        return this.setPostprocessor(callback);
    }
    returnResponse(response, records) {
        response.handlers.returnRecords(records);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SelectBuilder;
//# sourceMappingURL=select.js.map