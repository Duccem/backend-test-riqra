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
exports.CartMutations = exports.CartQuery = void 0;
const models_1 = require("../models");
const { Cart, CartDetail, Product } = models_1.Models;
const auth_1 = require("../lib/auth");
const logger_1 = __importDefault(require("../lib/logger"));
exports.CartQuery = {
    getCart: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const _userId = auth_1.getUserId(context);
            const cart = yield Cart.findOne({ where: { id: args.id, userId: _userId } });
            let products = [];
            let details = yield CartDetail.findAll({ where: { cartId: cart.id } });
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
            cart.products = products;
            return cart;
        }
        catch (error) {
            logger_1.default.log('On get cart', { type: 'error', color: 'error' });
            if (error == 'Not authenticated')
                throw new Error('Not authenticated');
            throw new Error('Internal error');
        }
    }),
};
exports.CartMutations = {
    createCart: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const _userId = auth_1.getUserId(context);
            const newCart = {
                userId: _userId,
                total: 0,
                subtotal: 0,
                tax: 0,
            };
            const cartCreated = yield Cart.create(newCart);
            newCart.id = cartCreated.null;
            return newCart;
        }
        catch (error) {
            console.log(error);
            logger_1.default.log('On create cart', { type: 'error', color: 'error' });
            if (error == 'Not authenticated')
                throw new Error('Not authenticated');
            throw new Error('Internal error');
        }
    }),
    addProductToCart: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const _userId = auth_1.getUserId(context);
            const cart = yield Cart.findOne({ where: { id: args.id, userId: _userId } });
            const product = yield Product.findOne({ where: { id: args.productId, userId: _userId } });
            if (!product)
                throw new Error('Product doesn`t exits');
            let price = 0;
            let totalprice = 0;
            let tax = 0;
            const detail = yield CartDetail.findOne({ where: { cartId: cart.id, productId: product.id } });
            if (detail) {
                price = (parseFloat(detail.quantity) + parseFloat(args.quantity)) * parseFloat(product.price);
                totalprice = parseFloat(cart.subtotal) - parseFloat(detail.quantity) * parseFloat(product.price) + price;
                yield CartDetail.update({ quantity: parseFloat(detail.quantity) + parseFloat(args.quantity) }, { where: { id: detail.id } });
            }
            else {
                let newDetail = {
                    userId: _userId,
                    cartId: cart.id,
                    productId: product.id,
                    quantity: parseFloat(args.quantity),
                    converted: false,
                };
                price = newDetail.quantity * parseFloat(product.price);
                totalprice = parseFloat(cart.subtotal) + price;
                yield CartDetail.create(newDetail);
            }
            tax = totalprice * 0.18;
            Cart.update({ subtotal: totalprice, tax: tax, total: totalprice + tax }, { where: { id: cart.id } });
            return 'Product added';
        }
        catch (error) {
            console.log(error);
            logger_1.default.log('On add product to a cart', { type: 'error', color: 'error' });
            if (error == 'Not authenticated')
                throw new Error('Not authenticated');
            if (error == 'Product doesn`t exits')
                throw new Error('Product doesn`t exits');
            throw new Error('Internal error');
        }
    }),
    removeProductFromCart: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const _userId = auth_1.getUserId(context);
            const cart = yield Cart.findOne({ where: { id: args.id, userId: _userId } });
            const product = yield Product.findOne({ where: { id: args.productId, userId: _userId } });
            if (!product)
                throw new Error('Product doesn`t exits');
            const detail = yield CartDetail.findOne({ where: { cartId: cart.id, productId: product.id } });
            if (!detail)
                throw new Error('The cart doesn`t have this product');
            let price = 0;
            let totalprice = 0;
            let tax = 0;
            if (detail.quantity - args.quantity <= 0) {
                price = detail.quantity * product.price;
                yield CartDetail.destroy({ where: { id: detail.id } });
            }
            else {
                price = args.quantity * product.price;
                yield CartDetail.update({ quantity: detail.quantity - args.quantity }, { where: { id: detail.id } });
            }
            totalprice = cart.subtotal - price;
            tax = totalprice * 0.18;
            Cart.update({ subtotal: totalprice, tax: tax, total: totalprice + tax }, { where: { id: cart.id } });
            return 'Product removed';
        }
        catch (error) {
            console.log(error);
            logger_1.default.log('On remove product from a cart', { type: 'error', color: 'error' });
            if (error == 'Not authenticated')
                throw new Error('Not authenticated');
            if (error == 'Product doesn`t exits')
                throw new Error('Product doesn`t exits');
            if (error == 'The cart doesn`t have this product')
                throw new Error('The cart doesn`t have this product');
            throw new Error('Internal error');
        }
    }),
};
