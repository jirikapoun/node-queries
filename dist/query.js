"use strict";
class Query {
    constructor(statement) {
        this.statement = statement;
    }
    addJoinStatement(statement) {
        if (!this.joinStatements)
            this.joinStatements = [];
        this.joinStatements.push(statement);
        return this;
    }
    addWhereStatement(statement) {
        if (!this.whereStatements)
            this.whereStatements = [];
        this.whereStatements.push(statement);
        return this;
    }
    addOrderByStatement(statement) {
        if (!this.orderStatements)
            this.orderStatements = [];
        this.orderStatements.push(statement);
        return this;
    }
    setLimitOffset(limit, offset) {
        this.limit = limit;
        this.offset = offset;
        return this;
    }
    setSetStatement(statement) {
        this.setStatement = statement;
        return this;
    }
    getWhereStatements() {
        return this.whereStatements;
    }
    toString() {
        let statement = this.statement;
        if (this.setStatement != null)
            statement += ' SET ' + this.setStatement;
        if (this.joinStatements && this.joinStatements.length > 0)
            statement += ' ' + this.joinStatements.join(' ');
        if (this.whereStatements && this.whereStatements.length > 0)
            statement += ' WHERE ' + this.whereStatements.join(' AND ');
        if (this.orderStatements && this.orderStatements.length > 0)
            statement += ' ORDER BY ' + this.orderStatements.join(', ');
        if (this.limit >= 0) {
            statement += ' LIMIT ' + this.limit;
            if (this.offset > 0)
                statement += ' OFFSET ' + this.offset;
        }
        else if (this.offset > 0)
            statement += ' LIMIT 18446744073709551615 OFFSET ' + this.offset;
        return statement;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Query;
//# sourceMappingURL=query.js.map