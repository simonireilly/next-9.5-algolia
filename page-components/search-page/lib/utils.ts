import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76');

export const DEFAULT_PROPS = {
  searchClient,
  indexName: 'instant_search'
};
