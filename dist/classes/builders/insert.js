"use strict";
const mysql = require("mysql2");
const abstract_1 = require("./abstract");
class InsertBuilder extends abstract_1.default {
    constructor(response, table) {
        let statement = mysql.format('INSERT INTO ??', [table]);
        super(response, statement, table);
    }
    set(record) {
        return this.setRecord(record);
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
    checkIfNotNull(fields) {
        return super.setNotNullFields(fields);
    }
    preprocess(callback) {
        return super.setPreprocessor(callback);
    }
    location(path) {
        this.locationPath = path;
        return this;
    }
    returnResponse(response, result) {
        response.created(this.locationPath + '/' + result.insertId);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InsertBuilder;
//# sourceMappingURL=insert.js.map