"use strict";
const mysql = require("mysql2");
const db_1 = require("../db");
class SelectOneHandler {
    constructor(response, table) {
        this.response = response;
        this.table = table;
        this.whereStatements = [];
        this.whereValues = [];
    }
    where(fieldsAndValues) {
        for (let key in fieldsAndValues) {
            let value = fieldsAndValues[key];
            this.whereStatements.push('?? = ?');
            this.whereValues.push(key, value);
        }
        return this;
    }
    whereAny(fieldsAndValues) {
        let subStatements = [];
        for (let key in fieldsAndValues) {
            let value = fieldsAndValues[key];
            subStatements.push('?? = ?');
            this.whereValues.push(key, value);
        }
        let statement = subStatements.join(' OR ');
        this.whereStatements.push(`( ${statement} )`);
        return this;
    }
    postprocess(callback) {
        this.callback = callback;
        return this;
    }
    execute() {
        let statement = 'SELECT ??.* FROM ??';
        let values = [this.table, this.table];
        if (this.whereStatements) {
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
                if (this.callback && records.length > 0) {
                    try {
                        this.callback(records[0]);
                        return this.response.handlers.returnFirstRecord(records);
                    }
                    catch (e) {
                        console.trace(e);
                        return this.response.internalServerError();
                    }
                }
                else {
                    return this.response.handlers.returnFirstRecord(records);
                }
            }
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SelectOneHandler;
//# sourceMappingURL=select-one.js.map