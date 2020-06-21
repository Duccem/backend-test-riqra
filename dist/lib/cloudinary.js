"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("cloudinary"));
const keys_1 = require("./keys");
cloudinary_1.default.v2.config(keys_1.cludinary);
exports.default = cloudinary_1.default;
