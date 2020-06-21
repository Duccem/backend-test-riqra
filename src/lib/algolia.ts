import algol from 'algoliasearch';
import { algolia } from './keys';
import logger from './logger';
const client = algol(algolia.app_id, algolia.admin_key);
const index = client.initIndex('products');
index
	.setSettings({
		searchableAttributes: ['name', 'brand'],
	})
	.then(() => {
		logger.log('Set the client settings of algolia', { color: 'system', type: 'server' });
	})
	.catch((e) => {
		console.log(e);
		logger.log(e, { type: 'error', color: 'error' });
	});

export default index;
