import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import { Logger } from 'ducenlogger';
import Product from '../models/Product';
const logger = new Logger();
dotenv.config();

cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const productQuery = {
	getProducts: async () => await Product.findAll(),
	getProduct: async (_parent: any, { id }: any) => await Product.findByPk(id),
};
export const productMutations = {
	createProduct: async (parent: any, args: any) => {
		const file = await args.image;
		const { createReadStream } = file;
		try {
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
				image: result.secure_url,
				cloudId: result.public_id,
			};
			const productCreated = await Product.create(newProduct);
			return productCreated;
		} catch (error) {
			logger.log('On upload to cloudinary', { color: 'error', type: 'error' });
		}
	},
	updateProduct: async (parent: any, args: any) => {
		const product = await Product.findByPk(args.id, { attributes: ['cloudId'] });
		if (!product) return 'Product doesn`t exits';
		const file = await args.image;
		const newProduct: any = {};
		if (file) {
			const { createReadStream } = file;
			try {
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
			} catch (error) {
				logger.log('On upload to cloudinary', { color: 'error', type: 'error' });
			}
		}

		newProduct.name = args.name;
		newProduct.brand = args.brand;
		newProduct.price = args.price;
		await Product.update(newProduct, { where: { id: args.id } });
		return await Product.findByPk(args.id);
	},
	deleteProduct: async (parent: any, { id }: any) => {
		try {
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
