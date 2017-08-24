"use strict";
const mysql = require("mysql2");
const db_1 = require("../db");
class SelectHandler {
    constructor(response, table) {
        this.response = response;
        this.table = table;
        this.joinStatement = '';
        this.joinValues = [];
        this.whereStatements = [];
        this.whereValues = [];
        this.orderStatements = [];
        this.orderValues = [];
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
    orderBy(column, ascOrDesc) {
        if (!ascOrDesc)
            ascOrDesc = 'ASC';
        this.orderStatements.push(`?? ${ascOrDesc}`);
        this.orderValues.push(column);
        return this;
    }
    limitOffset(limit, offset) {
        this.limit = limit;
        this.offset = offset;
        return this;
    }
    postprocess(callback) {
        this.callback = callback;
        return this;
    }
    execute() {
        let statement = 'SELECT ??.* FROM ??';
        let values = [this.table, this.table];
        if (this.joinStatement) {
            statement += this.joinStatement;
            Array.prototype.push.apply(values, this.joinValues);
        }
        if (this.whereStatements.length > 0) {
            statement += ' WHERE ' + this.whereStatements.join(' AND ');
            Array.prototype.push.apply(values, this.whereValues);
        }
        if (this.orderStatements.length > 0) {
            statement += ' ORDER BY ' + this.orderStatements.join(', ');
            Array.prototype.push.apply(values, this.orderValues);
        }
        if (this.limit >= 0) {
            statement += ' LIMIT ?';
            values.push(this.limit);
            if (this.offset > 0) {
                statement += ' OFFSET ?';
                values.push(this.offset);
            }
        }
        else if (this.offset > 0) {
            statement += ' LIMIT 18446744073709551615 OFFSET ?';
            values.push(this.offset);
        }
        db_1.default.connection.query(statement, values, (error, records) => {
            if (error) {
                let sql = mysql.format(statement, values);
                console.error(error);
                console.trace('Query failed: ' + sql);
                return this.response.internalServerError();
            }
            else {
                if (this.callback) {
                    try {
                        for (let i = 0; i < records.length; i++)
                            this.callback(records[i]);
                        return this.response.handlers.returnRecords(records);
                    }
                    catch (e) {
                        console.trace(e);
                        return this.response.internalServerError();
                    }
                }
                else {
                    return this.response.handlers.returnRecords(records);
                }
            }
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SelectHandler;
//# sourceMappingURL=select.js.map