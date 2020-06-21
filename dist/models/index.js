"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Models = void 0;
const Product_1 = __importDefault(require("./Product"));
const Cart_1 = __importDefault(require("./Cart"));
const User_1 = __importDefault(require("./User"));
const CartDetail_1 = __importDefault(require("./CartDetail"));
const Order_1 = __importDefault(require("./Order"));
exports.Models = {
    Product: Product_1.default,
    CartDetail: CartDetail_1.default,
    Cart: Cart_1.default,
    User: User_1.default,
    Order: Order_1.default,
};
