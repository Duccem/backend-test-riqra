import { sequelize } from '../database';
import Sequelize, { Model } from 'sequelize';
class Product extends Model {}
Product.init(
	{
		id: { type: Sequelize.INTEGER, primaryKey: true },
		name: { type: Sequelize.TEXT, validate: { max: 35 } },
		image: { type: Sequelize.TEXT },
		brand: { type: Sequelize.TEXT },
		price: { type: Sequelize.FLOAT },
		userId: { type: Sequelize.INTEGER },
		cloudId: { type: Sequelize.TEXT },
	},
	{
		sequelize,
		modelName: 'product',
		timestamps: false,
	}
);

export default Product;
