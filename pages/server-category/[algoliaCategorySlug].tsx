import { withRouter } from 'next/router';
import { findResultsState } from 'react-instantsearch-dom/server';
import qs from 'qs'
import { GetServerSideProps } from 'next';

import { App, AlgoliaPage, DEFAULT_PROPS } from '../../page-components/search-page';

export const getServerSideProps: GetServerSideProps = async ({ query, params }) => {
  // Tell NextJS how to build the query from the data returned
  console.group('getServerSideProps')
  const configure = {
    filters: `categories:'${params.algoliaCategorySlug}'`
  }

  const { algoliaCategorySlug, ...queryWithoutSlug } = query

  const searchState = queryWithoutSlug ? qs.parse(queryWithoutSlug) : {}

  const resultsState = await findResultsState(App, {
    ...DEFAULT_PROPS,
    searchState,
    configure
  });

  console.log('results state', resultsState?.rawResults[0].hits[0].name)
  console.groupEnd()
  return {
    props: {
      resultsState: JSON.parse(JSON.stringify(resultsState)),
      serverSideSearchState: searchState,
      configure
    },
  };
}

export default withRouter(AlgoliaPage);
