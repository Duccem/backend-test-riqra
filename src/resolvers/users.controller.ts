import { encriptar, validar } from '../lib/encript';
import User from '../models/User';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Logger } from 'ducenlogger';
const logger = new Logger();
dotenv.config();

export const UserMutations = {
	signup: async (parent: any, args: any) => {
		const newUser = args;
		const count = await User.count({ where: { email: args.email } });
		if (count > 0) throw new Error('User already exists');
		if (newUser.password.length <= 6) throw new Error('The password must be longer than 6 characters.');
		try {
			newUser.password = await encriptar(newUser.password);
			const createdUser = await User.create(newUser);

			const token = jwt.sign({ _id: createdUser.null }, process.env.TOKEN_KEY || '2423503', { expiresIn: 60 * 60 * 24 });
			return {
				user: args,
				token,
			};
		} catch (error) {
			logger.log('Error al hacer sign up', { type: 'error', color: 'error' });
			throw new Error('Internal error');
		}
	},
	login: async (parent: any, args: any) => {
		const user = await User.findOne({ where: { email: args.email } });
		if (!user) throw new Error('User not found');

		let valid = await validar(args.password, user.password);
		if (!valid) throw new Error('Oops! incorrect password');

		try {
			const token = jwt.sign({ _id: user.id }, process.env.TOKEN_KEY || '2423503', { expiresIn: 60 * 60 * 24 });
			return {
				user: args,
				token,
			};
		} catch (error) {
			logger.log('Error al hacer log in', { type: 'error', color: 'error' });
			throw new Error('Internal error');
		}
	},
};
