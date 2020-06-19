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
			};
			const productCreated = await Product.create(newProduct);
			return productCreated;
		} catch (error) {
			logger.log('On upload to cloudinary', { color: 'error', type: 'error' });
		}
	},
};
