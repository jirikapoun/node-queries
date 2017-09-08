"use strict";
const mysql = require("mysql2");
class DB {
    init(options) {
        this.connection = mysql.createConnection(options);
        this.connection.connect();
    }
    query(sql, values, callback) {
        return this.connection.query(sql, values, callback);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new DB;
//# sourceMappingURL=db.js.map