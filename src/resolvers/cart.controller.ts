import { Models } from '../models';
const { Cart, CartDetail, Product } = Models;
import { getUserId } from '../lib/auth';
import logger from '../lib/logger';

export const CartQuery = {
	getCart: async (parent: any, args: any, context: any) => {
		try {
			const _userId = getUserId(context);
			const cart = await Cart.findOne({ where: { id: args.id, userId: _userId } });
			let products = [];
			let details = await CartDetail.findAll({ where: { cartId: cart.id } });
			for (let index = 0; index < details.length; index++) {
				const element = details[index];
				let product = await Product.findOne({ where: { id: element.productId } });
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
		} catch (error) {
			logger.log('On get cart', { type: 'error', color: 'error' });
			if (error == 'Not authenticated') throw new Error('Not authenticated');
			throw new Error('Internal error');
		}
	},
};

export const CartMutations = {
	createCart: async (parent: any, args: any, context: any) => {
		try {
			const _userId = getUserId(context);
			const newCart: any = {
				userId: _userId,
				total: 0,
				subtotal: 0,
				tax: 0,
			};
			const cartCreated = await Cart.create(newCart);
			newCart.id = cartCreated.null;
			return newCart;
		} catch (error) {
			console.log(error);
			logger.log('On create cart', { type: 'error', color: 'error' });
			if (error == 'Not authenticated') throw new Error('Not authenticated');
			throw new Error('Internal error');
		}
	},
	addProductToCart: async (parent: any, args: any, context: any) => {
		try {
			const _userId = getUserId(context);
			const cart = await Cart.findOne({ where: { id: args.id, userId: _userId } });
			const product = await Product.findOne({ where: { id: args.productId, userId: _userId } });
			if (!product) throw new Error('Product doesn`t exits');

			let price = 0;
			let totalprice = 0;
			let tax = 0;
			const detail = await CartDetail.findOne({ where: { cartId: cart.id, productId: product.id } });
			if (detail) {
				price = (parseFloat(detail.quantity) + parseFloat(args.quantity)) * parseFloat(product.price);
				totalprice = parseFloat(cart.subtotal) - parseFloat(detail.quantity) * parseFloat(product.price) + price;
				await CartDetail.update({ quantity: parseFloat(detail.quantity) + parseFloat(args.quantity) }, { where: { id: detail.id } });
			} else {
				let newDetail = {
					userId: _userId,
					cartId: cart.id,
					productId: product.id,
					quantity: parseFloat(args.quantity),
					converted: false,
				};
				price = newDetail.quantity * parseFloat(product.price);
				totalprice = parseFloat(cart.subtotal) + price;
				await CartDetail.create(newDetail);
			}
			tax = totalprice * 0.18;
			Cart.update({ subtotal: totalprice, tax: tax, total: totalprice + tax }, { where: { id: cart.id } });
			return 'Product added';
		} catch (error) {
			logger.log('On add product to a cart', { type: 'error', color: 'error' });
			if (error == 'Not authenticated') throw new Error('Not authenticated');
			if (error == 'Product doesn`t exits') throw new Error('Product doesn`t exits');
			throw new Error('Internal error');
		}
	},
	removeProductFromCart: async (parent: any, args: any, context: any) => {
		try {
			const _userId = getUserId(context);
			const cart = await Cart.findOne({ where: { id: args.id, userId: _userId } });
			const product = await Product.findOne({ where: { id: args.productId, userId: _userId } });

			if (!product) throw new Error('Product doesn`t exits');

			const detail = await CartDetail.findOne({ where: { cartId: cart.id, productId: product.id } });
			if (!detail) throw new Error('The cart doesn`t have this product');

			let price = 0;
			let totalprice = 0;
			let tax = 0;
			if (detail.quantity - args.quantity <= 0) {
				price = detail.quantity * product.price;
				await CartDetail.destroy({ where: { id: detail.id } });
			} else {
				price = args.quantity * product.price;
				await CartDetail.update({ quantity: detail.quantity - args.quantity }, { where: { id: detail.id } });
			}
			totalprice = cart.subtotal - price;
			tax = totalprice * 0.18;
			Cart.update({ subtotal: totalprice, tax: tax, total: totalprice + tax }, { where: { id: cart.id } });
			return 'Product removed';
		} catch (error) {
			logger.log('On remove product from a cart', { type: 'error', color: 'error' });
			if (error == 'Not authenticated') throw new Error('Not authenticated');
			if (error == 'Product doesn`t exits') throw new Error('Product doesn`t exits');
			if (error == 'The cart doesn`t have this product') throw new Error('The cart doesn`t have this product');
			throw new Error('Internal error');
		}
	},
};
