"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserId = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
function getUserId(context) {
    const Authorization = context.req.get('Authorization');
    if (Authorization) {
        const token = Authorization;
        const { _id } = jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY || '2423503');
        return _id;
    }
    throw new Error('Not authenticated');
}
exports.getUserId = getUserId;
