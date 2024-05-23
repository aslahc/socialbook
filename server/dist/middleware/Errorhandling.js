"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    // console.error('Error:', err);
    const statusCode = res.statusCode || 500;
    res.status(statusCode).json({ message: err.message, stack: err.stack });
};
exports.errorHandler = errorHandler;
