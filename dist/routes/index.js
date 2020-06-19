"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.use('*', (req, res) => {
        res.status(404).json({ message: 'Route not found' });
    });
};
