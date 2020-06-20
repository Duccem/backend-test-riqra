import dotenv from 'dotenv';
dotenv.config();

export const algolia = {
	app_id: process.env.ALGOLIA_APP_ID || '',
	api_key: process.env.ALGOLIA_API_KEY || '',
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
