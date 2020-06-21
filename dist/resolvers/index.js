"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const products_controller_1 = require("./products.controller");
const users_controller_1 = require("./users.controller");
const cart_controller_1 = require("./cart.controller");
const order_controller_1 = require("./order.controller");
exports.default = {
    Query: Object.assign(Object.assign(Object.assign({}, products_controller_1.productQuery), cart_controller_1.CartQuery), order_controller_1.OrderQuery),
    Mutation: Object.assign(Object.assign(Object.assign(Object.assign({}, products_controller_1.productMutations), users_controller_1.UserMutations), cart_controller_1.CartMutations), order_controller_1.OrderMutations),
};
