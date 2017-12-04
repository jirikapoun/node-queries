"use strict";
const mysql = require("mysql2");
class CustomQueryBuilder {
    constructor(connection, sql) {
        this.connection = connection;
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
    execute(response) {
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
        this.connection.query(this.sql, this.values_, (error, records) => {
            if (error) {
                let sql = mysql.format(this.sql, this.values_);
                console.error(error);
                console.trace('Query failed: ' + sql);
                return response.internalServerError();
            }
            else {
                if (this.callback) {
                    try {
                        for (let i = 0; i < records.length; i++)
                            this.callback(records[i]);
                        return response.handlers.returnRecords(records);
                    }
                    catch (e) {
                        console.trace(e);
                        return response.internalServerError();
                    }
                }
                else {
                    return response.handlers.returnRecords(records);
                }
            }
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CustomQueryBuilder;
//# sourceMappingURL=custom-query.js.map