// These components control how the state of instantsearch is generated to/from a
// url
//
// If you want to do any masking of search state behind custom URLs this is
// where the majority of the work is required. Algolia needs to understand
// how to transform your masked URL to and from a searchState
//
// https://www.algolia.com/doc/guides/building-search-ui/going-further/routing-urls/react/#basic-urls
import { Router } from 'next/router';
import qs from 'qs';

// Use this method to take a NextJS router and create a search state.
//
// It must be reversible with respect to  `searchStateToURL` e.g.
//
// pathToSearchState(router) === pathToSearchState(searchStateToUrl(searchState))
export const pathToSearchState = (router: Router) => {
  const path = router.asPath

  return path.includes('?') ? qs.parse(path.substring(path.indexOf('?') + 1)) : {};
}

// Client side only method that builds an algolia searchState from the current
// page url.
//
// It should be fully reversible with respect to `pathToSearchState` e.g.
//
// searchStateToUrl(searchState) === searchStateToUrl(pathToSearchState(router))
export const searchStateToURL = (searchState) => {
  searchState ? `${window.location.pathname}?${qs.stringify(searchState)}` : '';
}

// Create the query string for react instantsearch
//
// This function determines what params get tagged onto the end fo the pages URL
// while performing client side navigation.
export const createURL = state => `?${qs.stringify(state)}`;

