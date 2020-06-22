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
const keys_1 = require("../lib/keys");
exports.OrderQuery = {
    getOrders: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const _userId = auth_1.getUserId(context);
            const orders = yield Order.findAll({ where: { userId: _userId } });
            for (let index = 0; index < orders.length; index++) {
                const element = orders[index];
                let products = [];
                let details = yield CartDetail.findAll({ where: { cartId: element.cartId } });
                for (let index1 = 0; index1 < details.length; index1++) {
                    const element1 = details[index1];
                    let product = yield Product.findOne({ where: { id: element1.productId } });
                    let newDetail = {
                        name: product.name,
                        brand: product.brand,
                        price: product.price,
                        image: product.image,
                        quantity: element.quantity,
                    };
                    products.push(newDetail);
                }
                orders[index].products = products;
            }
            return orders;
        }
        catch (error) {
            logger_1.default.log('On get carts', { type: 'error', color: 'error' });
            if (error == 'Not authenticated')
                throw new Error('Not authenticated');
            throw new Error('Internal error');
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
            if (cart.converted == true)
                throw new Error('The order have been created');
            const count = yield Order.count({ where: { userId: _userId } });
            let code = new String(count);
            const newOrder = {
                total: cart.total,
                subtotal: cart.subtotal,
                tax: cart.tax,
                code: 'P' + code.padStart(4, '0'),
                cartId: cart.id,
                userId: cart.userId,
            };
            const user = yield User.findByPk(_userId);
            let transporter = nodemailer_1.default.createTransport({
                service: 'Gmail',
                port: 465,
                secure: false,
                auth: {
                    user: keys_1.mail.mail,
                    pass: keys_1.mail.password,
                },
            });
            let { messageId } = yield transporter.sendMail({
                to: user.email,
                from: keys_1.mail.mail,
                subject: 'Order created',
                html: `
                    Yor order has been created with code ${newOrder.code}
                `,
            });
            const createdOrder = yield Order.create(newOrder);
            yield Cart.update({ converted: true }, { where: { id: args.id } });
            newOrder.id = createdOrder.null;
            return newOrder;
        }
        catch (error) {
            logger_1.default.log('On get carts', { type: 'error', color: 'error' });
            if ((error = 'The order have been created'))
                throw new Error('The order have been created');
            if (error == 'Not authenticated')
                throw new Error('Not authenticated');
            throw new Error('Internal error');
        }
    }),
};
