import { withRouter } from 'next/router';
import { findResultsState } from 'react-instantsearch-dom/server';
import qs from 'qs'
import { GetServerSideProps } from 'next';

import { App, AlgoliaPage, DEFAULT_PROPS } from '../page-components/search-page';

// This is a standard SSR implementation of algolia. Next JS exposes the full
// query object, so we can perform full server rendering
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const searchState = query ? qs.parse(query) : {}

  const resultsState = await findResultsState(App, {
    ...DEFAULT_PROPS,
    searchState,
  });

  return {
    props: {
      resultsState: JSON.parse(JSON.stringify(resultsState)),
      initialSearchState: searchState
    }
  };
}

export default withRouter(AlgoliaPage);
