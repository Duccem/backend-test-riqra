import Cart from '../models/Cart';
import CartDetail from '../models/CartDetail';
import Product from '../models/Product';
import { getUserId } from '../lib/auth';
import { Logger } from 'ducenlogger';

const logger = new Logger();

export const CartQuery = {
	getCarts: async (parent: any, args: any, context: any) => {
		try {
			const _userId = getUserId(context);
			const carts = await Cart.findAll({ where: { userId: _userId } });
			for (let index = 0; index < carts.length; index++) {
				const element = carts[index];
				let products = [];
				let details = await CartDetail.findAll({ where: { cartId: element.id } });
				for (let index1 = 0; index1 < details.length; index1++) {
					const element = details[index1];
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
				carts[index].products = products;
			}
			return carts;
		} catch (error) {
			logger.log('On get carts', { type: 'error', color: 'error' });
			return { message: 'Iternal error' };
		}
	},
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
			return { message: 'Iternal error' };
		}
	},
};

export const CartMutations = {
	createCart: async (parent: any, args: any, context: any) => {
		try {
			const _userId = getUserId(context);
			const newCart = {
				userId: _userId,
				total: 0,
				subtotal: 0,
				tax: 0,
			};
			const cartCreated = await Cart.create(newCart);
			return cartCreated;
		} catch (error) {
			logger.log('On create cart', { type: 'error', color: 'error' });
			return { message: 'Iternal error' };
		}
	},
	addProductToCart: async (parent: any, args: any, context: any) => {
		try {
			const _userId = getUserId(context);
			const cart = await Cart.findOne({ where: { id: args.id, userId: _userId } });
			const product = await Product.findOne({ where: { id: args.productId, userId: _userId } });

			if (!product) return { message: 'The product doesn`t exist' };

			let price = 0;
			let totalprice = 0;
			let tax = 0;
			const detail = await CartDetail.findOne({ where: { cartId: cart.id, productId: product.id } });
			if (detail) {
				price = (detail.quantity + args.quantity) * product.price;
				totalprice = cart.subtotal - detail.quantity * product.price + price;
				await CartDetail.update({ quantity: detail.quantity + args.quantity }, { where: { id: detail.id } });
			} else {
				let newDetail = {
					userId: _userId,
					productId: product.id,
					quantity: args.quantity <= 0 ? 0 : args.quantity,
				};
				price = newDetail.quantity * product.price;
				totalprice = cart.subtotal + price;
				await CartDetail.create(newDetail);
			}
			tax = totalprice * 0.18;
			Cart.update({ subtotal: totalprice, tax: tax, total: totalprice + tax }, { where: { id: cart.id } });
			return { message: 'Product added' };
		} catch (error) {
			logger.log('On add product to a cart', { type: 'error', color: 'error' });
			return { message: 'Iternal error' };
		}
	},
	removeProductFromCart: async (parent: any, args: any, context: any) => {
		try {
			const _userId = getUserId(context);
			const cart = await Cart.findOne({ where: { id: args.id, userId: _userId } });
			const product = await Product.findOne({ where: { id: args.productId, userId: _userId } });

			if (!product) return { message: 'The product doesn`t exist' };

			const detail = await CartDetail.findOne({ where: { cartId: cart.id, productId: product.id } });
			if (!detail) return { message: 'The cart doesn`t have this product' };

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
			return { message: 'Product removed' };
		} catch (error) {
			logger.log('On remove product from a cart', { type: 'error', color: 'error' });
			return { message: 'Iternal error' };
		}
	},
};
