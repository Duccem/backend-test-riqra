import algol from 'algoliasearch';
import { algolia } from './keys';
const client = algol(algolia.app_id, algolia.api_key);
const index = client.initIndex('products');
index
	.setSettings({
		searchableAttributes: ['name', 'brand'],
	})
	.then(() => {})
	.catch((e) => {});

export default index;
