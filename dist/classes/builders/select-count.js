"use strict";
const mysql = require("mysql2");
const abstract_1 = require("./abstract");
class SelectCountBuilder extends abstract_1.default {
    constructor(connection, table) {
        let statement = mysql.format('SELECT COUNT(*) AS "count" FROM ??', [table, table]);
        super(connection, statement, table);
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
    returnResponse(response, records) {
        let count = records[0]['count'];
        response.ok(count.toString(), 'text/plain');
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SelectCountBuilder;
//# sourceMappingURL=select-count.js.map