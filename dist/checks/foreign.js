"use strict";
const mysql = require("mysql2");
const db = require("../db");
const rxjs_1 = require("rxjs");
class SimpleCheck {
    constructor(table, keyColumn, keyValue, column, value) {
        this.statement = mysql.format('SELECT ?? AS "value" FROM ?? WHERE ?? = ?', [column, table, keyColumn, keyValue]);
        this.expectedValue = value;
    }
    check(whereStatements) {
        return rxjs_1.Observable.create((observer) => {
            db.default.query(this.statement, (error, rows) => {
                if (error) {
                    observer.error(error);
                }
                else if (rows.length > 0) {
                    var equals = true;
                    for (let row of rows) {
                        let value = row['value'];
                        if (value !== this.expectedValue) {
                            equals = false;
                            break;
                        }
                    }
                    observer.next(equals);
                }
                else
                    observer.next(null);
                observer.complete();
            });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SimpleCheck;
//# sourceMappingURL=foreign.js.map