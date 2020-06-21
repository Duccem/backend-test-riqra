"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMutations = void 0;
const encript_1 = require("../lib/encript");
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ducenlogger_1 = require("ducenlogger");
const logger = new ducenlogger_1.Logger();
dotenv_1.default.config();
exports.UserMutations = {
    signup: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = args;
        const count = yield User_1.default.count({ where: { email: args.email } });
        if (count > 0)
            throw new Error('User already exists');
        if (newUser.password.length <= 6)
            throw new Error('The password must be longer than 6 characters.');
        try {
            newUser.password = yield encript_1.encriptar(newUser.password);
            const createdUser = yield User_1.default.create(newUser);
            const token = jsonwebtoken_1.default.sign({ _id: createdUser.null }, process.env.TOKEN_KEY || '2423503', { expiresIn: 60 * 60 * 24 });
            return {
                user: args,
                token,
            };
        }
        catch (error) {
            logger.log('Error al hacer sign up', { type: 'error', color: 'error' });
            throw new Error('Internal error');
        }
    }),
    login: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User_1.default.findOne({ where: { email: args.email } });
        if (!user)
            throw new Error('User not found');
        let valid = yield encript_1.validar(args.password, user.password);
        if (!valid)
            throw new Error('Oops! incorrect password');
        try {
            const token = jsonwebtoken_1.default.sign({ _id: user.id }, process.env.TOKEN_KEY || '2423503', { expiresIn: 60 * 60 * 24 });
            return {
                user: args,
                token,
            };
        }
        catch (error) {
            logger.log('Error al hacer log in', { type: 'error', color: 'error' });
            throw new Error('Internal error');
        }
    }),
};
