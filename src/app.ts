import express, { Application, json, urlencoded, request } from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { Logger } from 'ducenlogger';
import schema from './schema';
import resolvers from './resolvers';
const logger = new Logger();
/**
 * Principal class of the project
 */
export class App {
	//Application object express
	private app: Application;

	/**
	 * App class constructor
	 * @param port Number of the http port
	 */
	constructor(private port?: number) {
		this.app = express();
		this.settings();
		this.middlewares();
		const server = new ApolloServer({
			typeDefs: gql(schema),
			resolvers,
			context: ({ req }) => {
				return { req };
			},
		});
		server.applyMiddleware({ app: this.app, path: '/api' });
	}

	private settings() {
		this.app.set('port', process.argv[2] || process.env.PORT || this.port || 3000);
	}

	private middlewares() {
		this.app.use(json());
		this.app.use(urlencoded({ extended: false }));
	}

	public listen() {
		logger.log(`listening on port ${this.app.get('port')}`, { color: 'warning', type: 'server' });
		this.app.listen(this.app.get('port'));
	}
}
