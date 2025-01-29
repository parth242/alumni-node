"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchError = void 0;
const catchError = (error) => {
    const errors = [];
    error.errors.map((item) => {
        errors.push(item.message);
    });
    return errors;
};
exports.catchError = catchError;
//# sourceMappingURL=functions.js.map