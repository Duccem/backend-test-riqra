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
const cloudinary_1 = __importDefault(require("cloudinary"));
const dotenv_1 = __importDefault(require("dotenv"));
const ducenlogger_1 = require("ducenlogger");
const Product_1 = __importDefault(require("../models/Product"));
const logger = new ducenlogger_1.Logger();
dotenv_1.default.config();
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.productQuery = {
    getProducts: () => __awaiter(void 0, void 0, void 0, function* () { return yield Product_1.default.findAll(); }),
    getProduct: (_parent, { id }) => __awaiter(void 0, void 0, void 0, function* () { return yield Product_1.default.findByPk(id); }),
};
exports.productMutations = {
    createProduct: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
        const file = yield args.image;
        const { createReadStream } = file;
        try {
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
                image: result.secure_url,
                cloudId: result.public_id,
            };
            const productCreated = yield Product_1.default.create(newProduct);
            return productCreated;
        }
        catch (error) {
            logger.log('On upload to cloudinary', { color: 'error', type: 'error' });
        }
    }),
    updateProduct: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield Product_1.default.findByPk(args.id, { attributes: ['cloudId'] });
        if (!product)
            return 'Product doesn`t exits';
        const file = yield args.image;
        const newProduct = {};
        if (file) {
            const { createReadStream } = file;
            try {
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
            catch (error) {
                logger.log('On upload to cloudinary', { color: 'error', type: 'error' });
            }
        }
        newProduct.name = args.name;
        newProduct.brand = args.brand;
        newProduct.price = args.price;
        yield Product_1.default.update(newProduct, { where: { id: args.id } });
        return yield Product_1.default.findByPk(args.id);
    }),
    deleteProduct: (parent, { id }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const product = yield Product_1.default.findByPk(id, { attributes: ['cloudId'] });
            if (!product)
                return 'Product not found';
            yield cloudinary_1.default.v2.uploader.destroy(product.cloudId);
            yield Product_1.default.destroy({ where: { id: id } });
            return 'Product deleted';
        }
        catch (error) {
            logger.log('Deleting record', { color: 'error', type: 'error' });
        }
    }),
};
