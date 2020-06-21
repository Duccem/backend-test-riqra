import { getUserId } from '../lib/auth';
import cloudinary from '../lib/cloudinary';
import index from '../lib/algolia';
import logger from '../lib/logger';
import { Models } from '../models';
const { Product } = Models;

export const productQuery = {
	search: async (_parent: any, args: any, context: any) => {
		try {
			const _userId = getUserId(context);
			const { hits } = await index.search(args.term, { page: args.page, length: args.limit });
			const products = hits;
			return products;
		} catch (error) {
			logger.log('On search', { color: 'error', type: 'error' });
			if (error == 'Not authenticated') throw new Error('Not authenticated');
			throw new Error('Internal error');
		}
	},
};

export const productMutations = {
	createProduct: async (_parent: any, args: any, context: any) => {
		if (args.name.length > 35) throw new Error('The name must not be longer than 35 characters.');
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
			const newProduct: any = {
				name: args.name,
				brand: args.brand,
				price: args.price,
				userId: userId,
				image: result.secure_url,
				cloudId: result.public_id,
			};
			const productCreated = await Product.create(newProduct);
			newProduct.objectID = productCreated.null;
			await index.saveObject(newProduct);
			newProduct.id = newProduct.objectID;
			return newProduct;
		} catch (error) {
			logger.log('On create a product', { color: 'error', type: 'error' });
			if (error == 'Not authenticated') throw new Error('Not authenticated');
			throw new Error('Internal error');
		}
	},
	updateProduct: async (_parent: any, args: any, context: any) => {
		try {
			const userId = getUserId(context);
			const product = await Product.findByPk(args.id, { attributes: ['cloudId'] });
			if (!product) throw new Error('Product doesn`t exits');
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
			newProduct.objectID = args.id;
			await index.partialUpdateObject(newProduct);
			return await Product.findByPk(args.id);
		} catch (error) {
			logger.log('On update a product', { color: 'error', type: 'error' });
			if (error == 'Not authenticated') throw new Error('Not authenticated');
			if (error == 'Product doesn`t exits') throw new Error('Product doesn`t exits');
			throw new Error('Internal error');
		}
	},
	deleteProduct: async (_parent: any, { id }: any, context: any) => {
		try {
			const userId = getUserId(context);
			const product = await Product.findByPk(id, { attributes: ['cloudId'] });
			if (!product) throw new Error('Product not found');
			await cloudinary.v2.uploader.destroy(product.cloudId);
			await index.deleteObject(id);
			await Product.destroy({ where: { id: id } });
			return 'Product deleted';
		} catch (error) {
			logger.log('Deleting record', { color: 'error', type: 'error' });
			if (error == 'Not authenticated') throw new Error('Not authenticated');
			if (error == 'Product not found') throw new Error('Product not found');
			throw new Error('Internal error');
		}
	},
};
