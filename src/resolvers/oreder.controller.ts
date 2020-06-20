import Order from '../models/Order';
import Cart from '../models/Cart';
import CartDetail from '../models/CartDetail';
import Product from '../models/Product';
import User from '../models/User';
import { getUserId } from '../lib/auth';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { Logger } from 'ducenlogger';
const logger = new Logger();
dotenv.config();

export const OrderQuery = {
	getOrder: async (parent: any, args: any, context: any) => {
		try {
			const _userId = getUserId(context);
			const order = await Order.findOne({ where: { id: args.id, userId: _userId } });
			let products = [];
			let details = await CartDetail.findAll({ where: { cartId: order.cartId } });
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
			order.products = products;
			return order;
		} catch (error) {
			logger.log('On get carts', { type: 'error', color: 'error' });
			return { message: 'Iternal error' };
		}
	},
};

export const OrderMutations = {
	convertCartToOrder: async (parent: any, args: any, context: any) => {
		try {
			const _userId = getUserId(context);
			const cart = await Cart.findOne({ where: { id: args.cartId, userId: _userId } });
			if (!cart) return { message: 'Cart doesn`t exists' };

			let code = new String(cart.id);
			const newOrder = {
				total: cart.total,
				subtotal: cart.subtotal,
				tax: cart.tax,
				code: 'P' + code.padStart(4, '0'),
				cartId: cart.id,
			};
			const user = await User.findByPk(_userId);
			let transporter = nodemailer.createTransport({
				service: 'Gmail',
				port: 465,
				secure: false,
				auth: {
					user: process.env.MAIL,
					pass: process.env.MAIL_PASSWORD,
				},
			});
			let { messageId } = await transporter.sendMail({
				to: user.email,
				from: process.env.MAIL,
				subject: 'Password recuperation',
				html: `
                    Yor order has been created with code ${newOrder.code}
                `,
			});
			const createdOrder = await Order.create(newOrder);
			return createdOrder;
		} catch (error) {
			logger.log('On get carts', { type: 'error', color: 'error' });
			return { message: 'Iternal error' };
		}
	},
};
