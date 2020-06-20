import { sequelize } from '../database';
import Sequelize, { Model } from 'sequelize';
import CartDetail from './CartDetail';
class Cart extends Model {}

Cart.init(
	{
		id: { type: Sequelize.INTEGER, primaryKey: true },
		total: { type: Sequelize.FLOAT },
		tax: { type: Sequelize.FLOAT },
		subtotal: { type: Sequelize.FLOAT },
		userId: { type: Sequelize.INTEGER },
	},
	{
		sequelize,
		modelName: 'cart',
		timestamps: false,
	}
);

Cart.hasMany(CartDetail, { foreignKey: 'cartId', sourceKey: 'id' });
CartDetail.belongsTo(Cart, { foreignKey: 'cartId', targetKey: 'id' });

export default Cart;
