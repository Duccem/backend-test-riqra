"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importStar(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const ducenlogger_1 = require("ducenlogger");
const schema_1 = __importDefault(require("./schema"));
const resolvers_1 = __importDefault(require("./resolvers"));
const logger = new ducenlogger_1.Logger();
/**
 * Principal class of the project
 */
class App {
    /**
     * App class constructor
     * @param port Number of the http port
     */
    constructor(port) {
        this.port = port;
        this.app = express_1.default();
        this.settings();
        this.middlewares();
        const server = new apollo_server_express_1.ApolloServer({
            typeDefs: apollo_server_express_1.gql(schema_1.default),
            resolvers: resolvers_1.default,
            context: ({ req }) => {
                return { req };
            },
            playground: true,
            introspection: true,
        });
        server.applyMiddleware({ app: this.app, path: '/api' });
    }
    settings() {
        this.app.set('port', process.argv[2] || process.env.PORT || this.port || 80);
    }
    middlewares() {
        this.app.use(express_1.json());
        this.app.use(express_1.urlencoded({ extended: false }));
    }
    listen() {
        logger.log(`listening on port ${this.app.get('port')}`, { color: 'warning', type: 'server' });
        this.app.listen(this.app.get('port'));
    }
}
exports.App = App;
