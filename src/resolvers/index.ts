import { productQuery, productMutations } from './products.controller';
import { UserMutations } from './users.controller';
import { CartQuery, CartMutations } from './cart.controller';
import { OrderQuery, OrderMutations } from './order.controller';
export default {
	Query: { ...productQuery, ...CartQuery, ...OrderQuery },
	Mutation: { ...productMutations, ...UserMutations, ...CartMutations, ...OrderMutations },
};
