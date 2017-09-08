"use strict";
class Params {
    constructor(request) {
        let params = request.swagger.params;
        for (let name in params) {
            let value = params[name].value;
            this[name] = value;
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Params;
//# sourceMappingURL=params.js.map