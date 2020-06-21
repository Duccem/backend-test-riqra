"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const algoliasearch_1 = __importDefault(require("algoliasearch"));
const keys_1 = require("./keys");
const logger_1 = __importDefault(require("./logger"));
const client = algoliasearch_1.default(keys_1.algolia.app_id, keys_1.algolia.admin_key);
const index = client.initIndex('products');
index
    .setSettings({
    searchableAttributes: ['name', 'brand'],
})
    .then(() => {
    logger_1.default.log('Set the client settings of algolia', { color: 'system', type: 'server' });
})
    .catch((e) => {
    console.log(e);
    logger_1.default.log(e, { type: 'error', color: 'error' });
});
exports.default = index;
