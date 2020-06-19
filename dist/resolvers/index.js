"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const products_controller_1 = require("./products.controller");
exports.default = {
    Query: Object.assign({}, products_controller_1.productQuery),
    Mutation: Object.assign({}, products_controller_1.productMutations),
};
