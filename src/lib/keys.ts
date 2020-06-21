import dotenv from 'dotenv';
dotenv.config();

export const algolia = {
	app_id: '9QCH2AXQ31',
	api_key: '982919b895eab1906490f69152cbcac6',
	admin_key: 'ad0cf5a75d8d40b59a895b50c290ee52',
};
export const cludinary = {
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
	api_key: process.env.CLOUDINARY_API_KEY || '',
	api_secret: process.env.CLOUDINARY_API_SECRET || '',
};
export const mail = {
	mail: process.env.MAIL,
	password: process.env.MAIL_PASSWORD,
};
export const port = process.env.PORT;
