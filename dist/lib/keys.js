"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.mail = exports.cludinary = exports.algolia = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.algolia = {
    app_id: '9QCH2AXQ31',
    api_key: '982919b895eab1906490f69152cbcac6',
    admin_key: 'ad0cf5a75d8d40b59a895b50c290ee52',
};
exports.cludinary = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
};
exports.mail = {
    mail: process.env.MAIL,
    password: process.env.MAIL_PASSWORD,
};
exports.port = process.env.PORT;
