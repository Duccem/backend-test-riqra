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
exports.OrderMutations = exports.OrderQuery = void 0;
const models_1 = require("../models");
const { Order, Cart, CartDetail, Product, User } = models_1.Models;
const auth_1 = require("../lib/auth");
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("../lib/logger"));
exports.OrderQuery = {
    getOrder: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const _userId = auth_1.getUserId(context);
            const order = yield Order.findOne({ where: { id: args.id, userId: _userId } });
            let products = [];
            let details = yield CartDetail.findAll({ where: { cartId: order.cartId } });
            for (let index = 0; index < details.length; index++) {
                const element = details[index];
                let product = yield Product.findOne({ where: { id: element.productId } });
                let newDetail = {
                    name: product.name,
                    brand: product.brand,
                    price: product.price,
                    image: product.image,
                    quantity: element.quantity,
                };
                products.push(newDetail);
            }
            order.products = products;
            return order;
        }
        catch (error) {
            logger_1.default.log('On get carts', { type: 'error', color: 'error' });
            return { message: 'Iternal error' };
        }
    }),
};
exports.OrderMutations = {
    convertCartToOrder: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const _userId = auth_1.getUserId(context);
            const cart = yield Cart.findOne({ where: { id: args.id, userId: _userId } });
            if (!cart)
                return {};
            let code = new String(cart.id);
            const newOrder = {
                total: cart.total,
                subtotal: cart.subtotal,
                tax: cart.tax,
                code: 'P' + code.padStart(4, '0'),
                cartId: cart.id,
            };
            const user = yield User.findByPk(_userId);
            let transporter = nodemailer_1.default.createTransport({
                service: 'Gmail',
                port: 465,
                secure: false,
                auth: {
                    user: 'ducen29@gmail.com',
                    pass: '2979Jose#$',
                },
            });
            let { messageId } = yield transporter.sendMail({
                to: user.email,
                from: 'ducen29@gmail.com',
                subject: 'Password recuperation',
                html: `
                    Yor order has been created with code ${newOrder.code}
                `,
            });
            const createdOrder = yield Order.create(newOrder);
            newOrder.id = createdOrder.null;
            return newOrder;
        }
        catch (error) {
            console.log(error);
            logger_1.default.log('On get carts', { type: 'error', color: 'error' });
            return { message: 'Iternal error' };
        }
    }),
};
