import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();
export function getUserId(context: any) {
	const Authorization = context.request.get('Authorization');
	if (Authorization) {
		const token = Authorization.replace('Bearer ', '');
		const { _id }: any = jwt.verify(token, process.env.TOKEN_KEY || '2423503');
		return _id;
	}

	throw new Error('Not authenticated');
}
