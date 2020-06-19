import { productQuery, productMutations } from './products.controller';
export default {
	Query: { ...productQuery },
	Mutation: { ...productMutations },
};
