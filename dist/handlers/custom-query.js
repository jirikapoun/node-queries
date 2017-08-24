"use strict";
const mysql = require("mysql2");
const db_1 = require("../db");
class CustomQueryHandler {
    constructor(response, sql) {
        this.response = response;
        this.sql = sql;
        this.values_ = [];
    }
    values(values) {
        this.values_ = values;
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
        if (this.limit >= 0) {
            this.sql += ' LIMIT ?';
            this.values_.push(this.limit);
            if (this.offset > 0) {
                this.sql += ' OFFSET ?';
                this.values_.push(this.offset);
            }
        }
        else if (this.offset > 0) {
            this.sql += ' LIMIT 18446744073709551615 OFFSET ?';
            this.values_.push(this.offset);
        }
        db_1.default.connection.query(this.sql, this.values_, (error, records) => {
            if (error) {
                let sql = mysql.format(this.sql, this.values_);
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
exports.default = CustomQueryHandler;
//# sourceMappingURL=custom-query.js.map