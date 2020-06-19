import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const database = {
	name: process.env.DATABASE_NAME || '',
	user: process.env.DATABASE_USER || 'root',
	password: process.env.DATABASE_PASSWORD || '',
	host: process.env.DATABASE_HOST || 'localhost',
};

export const sequelize = new Sequelize(database.name, database.user, database.password, {
	dialect: 'mysql',
	host: database.host,
	logging: false,
});
