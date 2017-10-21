"use strict";
const mysql = require("mysql2");
const abstract_1 = require("./abstract");
class SelectOneBuilder extends abstract_1.default {
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
    postprocess(callback) {
        return this.setPostprocessor(callback);
    }
    returnResponse(response, records) {
        response.handlers.returnFirstRecord(records);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SelectOneBuilder;
//# sourceMappingURL=select-one.js.map