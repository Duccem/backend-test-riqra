"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const sequelize_1 = __importStar(require("sequelize"));
const CartDetail_1 = __importDefault(require("./CartDetail"));
class Cart extends sequelize_1.Model {
}
Cart.init({
    id: { type: sequelize_1.default.INTEGER, primaryKey: true },
    total: { type: sequelize_1.default.FLOAT },
    tax: { type: sequelize_1.default.FLOAT },
    subtotal: { type: sequelize_1.default.FLOAT },
    userId: { type: sequelize_1.default.INTEGER },
}, {
    sequelize: database_1.sequelize,
    modelName: 'cart',
    timestamps: false,
});
Cart.hasMany(CartDetail_1.default, { foreignKey: 'cartId', sourceKey: 'id' });
CartDetail_1.default.belongsTo(Cart, { foreignKey: 'cartId', targetKey: 'id' });
exports.default = Cart;
