import { sequelize } from '../database';
import Sequelize, { Model } from 'sequelize';
import Product from './Product';
class CartDetail extends Model {}

CartDetail.init(
	{
		id: { type: Sequelize.INTEGER, primaryKey: true },
		cartId: { type: Sequelize.INTEGER },
		productId: { type: Sequelize.INTEGER },
		quantity: { type: Sequelize.FLOAT },
	},
	{
		sequelize,
		modelName: 'cartdetail',
		timestamps: false,
	}
);

export default CartDetail;
