import { encriptar, validar } from '../lib/encript';
import User from '../models/User';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Logger } from 'ducenlogger';
const logger = new Logger();
dotenv.config();

export const UserMutations = {
	signup: async (parent: any, args: any) => {
		try {
			const newUser = args;
			const count = await User.count({ where: { email: args.email } });
			if (count > 0) return { message: 'The email is already in use' };

			newUser.password = await encriptar(newUser.password);
			await User.create(newUser);

			const token = jwt.sign({ _id: newUser.email }, process.env.TOKEN_KEY || '2423503', { expiresIn: 60 * 60 * 24 });
			return {
				user: args,
				token,
			};
		} catch (error) {
			logger.log('Error al hacer sign up', { type: 'error', color: 'error' });
			return { message: 'Internal Error' };
		}
	},
	login: async (parent: any, args: any) => {
		try {
			const user = await User.findOne({ where: { email: args.email } });
			if (!user) return { message: 'User not found' };

			let valid = await validar(args.password, user.password);
			if (!valid) return { message: 'Incorrect password' };

			const token = jwt.sign({ _id: user.email }, process.env.TOKEN_KEY || '2423503', { expiresIn: 60 * 60 * 24 });
			return {
				user: args,
				token,
			};
		} catch (error) {
			logger.log('Error al hacer log in', { type: 'error', color: 'error' });
			return { message: 'Internal Error' };
		}
	},
};
