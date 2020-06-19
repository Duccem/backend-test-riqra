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
const Product_1 = __importDefault(require("./Product"));
class User extends sequelize_1.Model {
}
User.init({
    id: { type: sequelize_1.default.INTEGER, primaryKey: true },
    name: { type: sequelize_1.default.TEXT },
    email: { type: sequelize_1.default.TEXT },
    password: { type: sequelize_1.default.TEXT },
}, { sequelize: database_1.sequelize, modelName: 'user', timestamps: false });
User.hasMany(Product_1.default, { foreignKey: 'userId', sourceKey: 'id' });
Product_1.default.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });
exports.default = User;
