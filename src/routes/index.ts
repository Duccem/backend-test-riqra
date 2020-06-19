import { Application, Request, Response } from 'express';
export default (app: Application) => {
	app.use('*', (req: Request, res: Response) => {
		res.status(404).json({ message: 'Route not found' });
	});
};
