"use strict";
const mysql = require("mysql2");
class DB {
    init(options) {
        this.connection = mysql.createConnection(options);
        this.connection.connect();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new DB;
//# sourceMappingURL=db.js.map