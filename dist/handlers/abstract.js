"use strict";
const mysql = require("mysql2");
const rxjs_1 = require("rxjs");
const query_1 = require("../query");
const simple_1 = require("../checks/simple");
const foreign_1 = require("../checks/foreign");
const joined_1 = require("../checks/joined");
const db_1 = require("../db");
class AbstractHandler {
    constructor(response, statement, table) {
        this.response = response;
        this.query = new query_1.default(statement);
        this.table = table;
    }
    createJoinUsingStatement(joinTable, using) {
        let statement = mysql.format('JOIN ?? USING (??)', [joinTable, using]);
        this.query.addJoinStatement(statement);
        return this;
    }
    createJoinOnStatement(joinTable, firstKey, secondKey) {
        let statement = mysql.format('JOIN ?? ON ?? = ??', [joinTable, firstKey, secondKey]);
        this.query.addJoinStatement(statement);
        return this;
    }
    createWhereStatement(criteria, disjunctive = false, checkEmptiness = false) {
        let subStatements = [];
        for (let key in criteria) {
            let value = criteria[key];
            if (value || !checkEmptiness) {
                let statement = mysql.format('?? IN (?)', [key, value]);
                subStatements.push(statement);
            }
        }
        if (subStatements.length > 0) {
            let statement = '(' + subStatements.join(disjunctive ? ' OR ' : ' AND ') + ')';
            this.query.addWhereStatement(statement);
        }
        return this;
    }
    createWhereLikeStatement(criteria, disjunctive = false, checkEmptiness = true) {
        let subStatements = [];
        for (let key in criteria) {
            let value = criteria[key];
            if (value || !checkEmptiness) {
                let statement = mysql.format("?? LIKE CONCAT('%', ?, '%')", [key, value]);
                subStatements.push(statement);
            }
        }
        if (subStatements.length > 0) {
            let statement = '(' + subStatements.join(disjunctive ? ' OR ' : ' AND ') + ')';
            this.query.addWhereStatement(statement);
        }
        return this;
    }
    createOrderByStatement(column, ascOrDesc) {
        let statement = mysql.format('?? ' + (ascOrDesc || 'ASC'), [column]);
        this.query.addOrderByStatement(statement);
        return this;
    }
    addSimpleCheck(column, value) {
        let check = new simple_1.default(this.table, column, value);
        this.checks = this.checks || [];
        this.checks.push(check);
        return this;
    }
    addJoinedCheck(joinedTable, using, column, value) {
        let check = new joined_1.default(this.table, joinedTable, using, column, value);
        this.checks = this.checks || [];
        this.checks.push(check);
        return this;
    }
    addForeignCheck(table, keyColumn, keyValue, column, value) {
        let check = new foreign_1.default(table, keyColumn, keyValue, column, value);
        this.checks = this.checks || [];
        this.checks.push(check);
        return this;
    }
    setLimitOffset(limit, offset) {
        this.query.setLimitOffset(limit, offset);
        return this;
    }
    setRecord(record) {
        this.record = record;
        return this;
    }
    setExpectedValues(values) {
        this.expectedValues = values;
        return this;
    }
    setUnsettableFields(fields) {
        this.unsettableFields = fields;
        return this;
    }
    setUnchangeableFields(fields) {
        this.unchangeableFields = fields;
        return this;
    }
    setNotNullFields(fields) {
        this.notNullFields = fields;
        return this;
    }
    setUnsetOrNotNullFields(fields) {
        this.unsetOrNotNullFields = fields;
        return this;
    }
    setPreprocessor(preprocessor) {
        this.preprocessor = preprocessor;
        return this;
    }
    setPostprocessor(postprocessor) {
        this.postprocessor = postprocessor;
        return this;
    }
    execute() {
        if (this.notNullFields) {
            for (let field of this.notNullFields) {
                if (this.record[field] == null)
                    return this.response.badRequest("Field '" + field + "' has to be set");
            }
        }
        if (this.unsetOrNotNullFields) {
            for (let field of this.unsetOrNotNullFields) {
                if (this.record[field] === null)
                    return this.response.badRequest("Field '" + field + "' has to be either unset or not null");
            }
        }
        if (this.unsettableFields) {
            for (let field of this.unsettableFields) {
                if (this.record[field] == null)
                    delete this.record[field];
                else
                    return this.response.badRequest("Field '" + field + "' cannot be set explicitly");
            }
        }
        for (let field in this.expectedValues) {
            if (this.record[field] == null)
                this.record[field] = this.expectedValues[field];
            else if (this.record[field] !== this.expectedValues[field])
                return this.response.badRequest("Invalid value '" + this.record[field] + "' in field '" + field + "', should be '" + this.expectedValues[field] + "'");
        }
        if (this.preprocessor) {
            try {
                this.record = this.preprocessor(this.record);
            }
            catch (e) {
                console.trace(e);
                return this.response.badRequest('Received record could not be processed');
            }
        }
        if (this.record) {
            let setStatement = mysql.escape(this.record);
            this.query.setSetStatement(setStatement);
        }
        if (this.checks) {
            let whereStatements = this.query.getWhereStatements();
            let observables = this.checks.map(check => check.check(whereStatements));
            rxjs_1.Observable
                .combineLatest(observables)
                .subscribe(results => {
                let notFound = results.some(result => result === null);
                let forbidden = results.some(result => result === false);
                if (notFound)
                    this.response.notFound();
                else if (forbidden)
                    this.response.forbidden();
                else
                    this.runQuery();
            });
        }
        else
            this.runQuery();
    }
    runQuery() {
        let statement = this.query.toString();
        db_1.default.query(statement, (error, records) => {
            if (error) {
                console.error(error);
                console.trace('Query failed: ' + statement);
                return this.response.internalServerError();
            }
            else {
                if (this.postprocessor) {
                    try {
                        for (let i = 0; i < records.length; i++) {
                            let result = this.postprocessor(records[i]);
                            if (result !== undefined)
                                records[i] = result;
                        }
                    }
                    catch (e) {
                        console.trace(e);
                        return this.response.internalServerError();
                    }
                }
                this.returnResponse(this.response, records);
            }
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AbstractHandler;
//# sourceMappingURL=abstract.js.map