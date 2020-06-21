import { Models } from '../models';
const { Order, Cart, CartDetail, Product, User } = Models;
import { getUserId } from '../lib/auth';
import nodemailer from 'nodemailer';
import logger from '../lib/logger';
import { mail } from '../lib/keys';

export const OrderQuery = {
	getOrders: async (parent: any, args: any, context: any) => {
		try {
			const _userId = getUserId(context);
			const orders = await Order.findAll({ where: { userId: _userId } });
			for (let index = 0; index < orders.length; index++) {
				const element = orders[index];
				let products = [];
				let details = await CartDetail.findAll({ where: { cartId: element.cartId } });
				for (let index1 = 0; index1 < details.length; index1++) {
					const element1 = details[index1];
					let product = await Product.findOne({ where: { id: element1.productId } });
					let newDetail = {
						name: product.name,
						brand: product.brand,
						price: product.price,
						image: product.image,
						quantity: element.quantity,
					};
					products.push(newDetail);
				}
				orders[index].products = products;
			}
			return orders;
		} catch (error) {
			logger.log('On get carts', { type: 'error', color: 'error' });
			if (error == 'Not authenticated') throw new Error('Not authenticated');
			throw new Error('Internal error');
		}
	},
};

export const OrderMutations = {
	convertCartToOrder: async (parent: any, args: any, context: any) => {
		try {
			const _userId = getUserId(context);
			const cart = await Cart.findOne({ where: { id: args.id, userId: _userId } });
			if (!cart) return {};
			if (cart.converted == true) throw new Error('The order have been created');

			const count = await Order.count({ where: { userId: _userId } });
			let code = new String(count);
			const newOrder: any = {
				total: cart.total,
				subtotal: cart.subtotal,
				tax: cart.tax,
				code: 'P' + code.padStart(4, '0'),
				cartId: cart.id,
				userId: cart.userId,
			};
			const user = await User.findByPk(_userId);
			let transporter = nodemailer.createTransport({
				service: 'Gmail',
				port: 465,
				secure: false,
				auth: {
					user: mail.mail,
					pass: mail.password,
				},
			});
			let { messageId } = await transporter.sendMail({
				to: user.email,
				from: 'ducen29@gmail.com',
				subject: 'Order created',
				html: `
                    Yor order has been created with code ${newOrder.code}
                `,
			});
			const createdOrder = await Order.create(newOrder);
			await Cart.update({ converted: true }, { where: { id: args.id } });
			newOrder.id = createdOrder.null;
			return newOrder;
		} catch (error) {
			logger.log('On get carts', { type: 'error', color: 'error' });
			if ((error = 'The order have been created')) throw new Error('The order have been created');
			if (error == 'Not authenticated') throw new Error('Not authenticated');
			throw new Error('Internal error');
		}
	},
};
