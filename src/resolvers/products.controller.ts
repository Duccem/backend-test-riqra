import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import { Logger } from 'ducenlogger';
import Product from '../models/Product';
import { getUserId } from '../lib/auth';
const logger = new Logger();
dotenv.config();

cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const productQuery = {
	getProducts: async (_parent: any, _args: any, context: any) => {
		try {
			const _userId = getUserId(context);
			return await Product.findAll({ where: { userId: _userId } });
		} catch (error) {
			return { message: 'Not Authorized' };
		}
	},
	getProduct: async (_parent: any, { id }: any) => await Product.findByPk(id),
};
export const productMutations = {
	createProduct: async (_parent: any, args: any, context: any) => {
		try {
			const userId = getUserId(context);
			const file = await args.image;
			const { createReadStream } = file;
			const result: any = await new Promise((resolve, reject) => {
				const cloudStream = cloudinary.v2.uploader.upload_stream({ folder: 'riqra' }, (error, file) => {
					if (error) reject(error);
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
			const productCreated = await Product.create(newProduct);
			return productCreated;
		} catch (error) {
			logger.log('On create a product', { color: 'error', type: 'error' });
		}
	},
	updateProduct: async (_parent: any, args: any, context: any) => {
		try {
			const userId = getUserId(context);
			const product = await Product.findByPk(args.id, { attributes: ['cloudId'] });
			if (!product) return 'Product doesn`t exits';
			const file = await args.image;
			const newProduct: any = {};
			if (file) {
				const { createReadStream } = file;
				await cloudinary.v2.uploader.destroy(product.cloudId);
				const result: any = await new Promise((resolve, reject) => {
					const cloudStream = cloudinary.v2.uploader.upload_stream({ folder: 'riqra' }, (error, file) => {
						if (error) reject(error);
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
			await Product.update(newProduct, { where: { id: args.id } });
			return await Product.findByPk(args.id);
		} catch (error) {
			logger.log('On update a product', { color: 'error', type: 'error' });
			return { message: 'Not Authenticated' };
		}
	},
	deleteProduct: async (_parent: any, { id }: any, context: any) => {
		try {
			const userId = getUserId(context);
			const product = await Product.findByPk(id, { attributes: ['cloudId'] });
			if (!product) return 'Product not found';
			await cloudinary.v2.uploader.destroy(product.cloudId);
			await Product.destroy({ where: { id: id } });
			return 'Product deleted';
		} catch (error) {
			logger.log('Deleting record', { color: 'error', type: 'error' });
		}
	},
};
