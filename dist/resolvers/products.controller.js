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
exports.productMutations = exports.productQuery = void 0;
const auth_1 = require("../lib/auth");
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const algolia_1 = __importDefault(require("../lib/algolia"));
const logger_1 = __importDefault(require("../lib/logger"));
const models_1 = require("../models");
const { Product } = models_1.Models;
exports.productQuery = {
    search: (_parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const _userId = auth_1.getUserId(context);
            const { hits } = yield algolia_1.default.search(args.term, { page: args.page, length: args.limit });
            const products = hits;
            return products;
        }
        catch (error) {
            return { message: 'Not Authorized' };
        }
    }),
};
exports.productMutations = {
    createProduct: (_parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = auth_1.getUserId(context);
            const file = yield args.image;
            const { createReadStream } = file;
            const result = yield new Promise((resolve, reject) => {
                const cloudStream = cloudinary_1.default.v2.uploader.upload_stream({ folder: 'riqra' }, (error, file) => {
                    if (error)
                        reject(error);
                    resolve(file);
                });
                createReadStream().pipe(cloudStream);
            });
            const newProduct = {
                name: args.name,
                brand: args.brand,
                price: args.price,
                userId: userId,
                image: result.secure_url,
                cloudId: result.public_id,
            };
            const productCreated = yield Product.create(newProduct);
            newProduct.objectID = productCreated.null;
            yield algolia_1.default.saveObject(newProduct);
            return productCreated;
        }
        catch (error) {
            console.log(error);
            logger_1.default.log('On create a product', { color: 'error', type: 'error' });
        }
    }),
    updateProduct: (_parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = auth_1.getUserId(context);
            const product = yield Product.findByPk(args.id, { attributes: ['cloudId'] });
            if (!product)
                return 'Product doesn`t exits';
            const file = yield args.image;
            const newProduct = {};
            if (file) {
                const { createReadStream } = file;
                yield cloudinary_1.default.v2.uploader.destroy(product.cloudId);
                const result = yield new Promise((resolve, reject) => {
                    const cloudStream = cloudinary_1.default.v2.uploader.upload_stream({ folder: 'riqra' }, (error, file) => {
                        if (error)
                            reject(error);
                        resolve(file);
                    });
                    createReadStream().pipe(cloudStream);
                });
                newProduct.image = result.secure_url;
                newProduct.cloudId = result.public_id;
            }
            newProduct.name = args.name;
            newProduct.brand = args.brand;
            newProduct.price = args.price;
            yield Product.update(newProduct, { where: { id: args.id } });
            newProduct.objectID = args.id;
            yield algolia_1.default.partialUpdateObject(newProduct);
            return yield Product.findByPk(args.id);
        }
        catch (error) {
            logger_1.default.log('On update a product', { color: 'error', type: 'error' });
            return { message: 'Not Authenticated' };
        }
    }),
    deleteProduct: (_parent, { id }, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = auth_1.getUserId(context);
            const product = yield Product.findByPk(id, { attributes: ['cloudId'] });
            if (!product)
                return 'Product not found';
            yield cloudinary_1.default.v2.uploader.destroy(product.cloudId);
            yield algolia_1.default.deleteObject(id);
            yield Product.destroy({ where: { id: id } });
            return 'Product deleted';
        }
        catch (error) {
            logger_1.default.log('Deleting record', { color: 'error', type: 'error' });
        }
    }),
};
