"use strict";
const mysql = require("mysql2");
const abstract_1 = require("./abstract");
class UpdateBuilder extends abstract_1.default {
    constructor(response, table) {
        let statement = mysql.format('UPDATE ??', [table]);
        super(response, statement, table);
    }
    set(record) {
        return this.setRecord(record);
    }
    where(criteria) {
        return this.createWhereStatement(criteria);
    }
    checkPermission(column, value) {
        return this.addSimpleCheck(column, value);
    }
    checkPermissionWithJoin(joinedTable, using, column, value) {
        return this.addJoinedCheck(joinedTable, using, column, value);
    }
    checkPermissionElsewhere(table, keyColumn, keyValue, column, value) {
        return this.addForeignCheck(table, keyColumn, keyValue, column, value);
    }
    checkOrSet(expectedValues) {
        return super.setExpectedValues(expectedValues);
    }
    unsetIfNull(fields) {
        return super.setUnsettableFields(fields);
    }
    checkIfUnsetOrNotNull(fields) {
        return super.setUnsetOrNotNullFields(fields);
    }
    checkIfUnchanged(fields) {
        return super.setUnchangeableFields(fields);
    }
    preprocess(callback) {
        return super.setPreprocessor(callback);
    }
    returnResponse(response, result) {
        response.noContent();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UpdateBuilder;
//# sourceMappingURL=update.js.map