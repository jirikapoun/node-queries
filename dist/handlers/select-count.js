"use strict";
const mysql = require("mysql2");
const db_1 = require("../db");
class SelectCountHandler {
    constructor(response, table) {
        this.response = response;
        this.table = table;
        this.joinStatement = '';
        this.joinValues = [];
        this.whereStatements = [];
        this.whereValues = [];
    }
    joinUsing(table, column) {
        this.joinStatement += ' JOIN ?? USING (??)';
        this.joinValues.push(table, column);
        return this;
    }
    where(fieldsAndValues) {
        for (let key in fieldsAndValues) {
            let value = fieldsAndValues[key];
            this.whereStatements.push('?? = ?');
            this.whereValues.push(key, value);
        }
        return this;
    }
    whereIn(fieldsAndValues) {
        for (let key in fieldsAndValues) {
            let values = fieldsAndValues[key];
            if (values) {
                this.whereStatements.push('?? IN (?)');
                this.whereValues.push(key, values);
            }
        }
        return this;
    }
    whereLike(fieldsAndValues) {
        for (let key in fieldsAndValues) {
            let value = fieldsAndValues[key];
            if (value) {
                this.whereStatements.push("?? LIKE CONCAT('%', ?, '%')");
                this.whereValues.push(key, value);
            }
        }
        return this;
    }
    execute() {
        let statement = 'SELECT COUNT(*) AS "count" FROM ??';
        let values = [this.table];
        if (this.joinStatement) {
            statement += this.joinStatement;
            Array.prototype.push.apply(values, this.joinValues);
        }
        if (this.whereStatements.length > 0) {
            statement += ' WHERE ' + this.whereStatements.join(' AND ');
            Array.prototype.push.apply(values, this.whereValues);
        }
        db_1.default.connection.query(statement, values, (error, records) => {
            if (error) {
                let sql = mysql.format(statement, values);
                console.error(error);
                console.trace('Query failed: ' + sql);
                return this.response.internalServerError();
            }
            else {
                let count = records[0].count.toString();
                this.response.ok(count, 'text/plain');
            }
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SelectCountHandler;
//# sourceMappingURL=select-count.js.map