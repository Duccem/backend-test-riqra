import { sequelize } from '../database';
import Sequelize, { Model } from 'sequelize';
class Order extends Model {}

Order.init(
	{
		id: { type: Sequelize.INTEGER, primaryKey: true },
		code: { type: Sequelize.TEXT },
		subtotal: { type: Sequelize.FLOAT },
		tax: { type: Sequelize.FLOAT },
		total: { type: Sequelize.FLOAT },
		cartId: { type: Sequelize.INTEGER },
	},
	{
		sequelize,
		modelName: 'order',
		timestamps: false,
	}
);

export default Order;
