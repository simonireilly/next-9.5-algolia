import qs from 'qs';
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76');

export const createURL = state => `?${qs.stringify(state)}`;

export const pathToSearchState = path =>
  path.includes('?') ? qs.parse(path.substring(path.indexOf('?') + 1)) : {};

export const searchStateToURL = searchState =>
  searchState ? `${window.location.pathname}?${qs.stringify(searchState)}` : '';

export const DEFAULT_PROPS = { searchClient, indexName: 'instant_search' };
