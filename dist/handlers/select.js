"use strict";
const mysql = require("mysql2");
const abstract_1 = require("./abstract");
class SelectHandler extends abstract_1.default {
    constructor(response, table) {
        let statement = mysql.format('SELECT ??.* FROM ??', [table, table]);
        super(response, statement, table);
    }
    joinUsing(joinTable, using) {
        return this.createJoinUsingStatement(joinTable, using);
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
exports.default = SelectHandler;
//# sourceMappingURL=select.js.map