import { withRouter } from 'next/router';
import { findResultsState } from 'react-instantsearch-dom/server';
import qs from 'qs'
import { GetStaticProps, GetStaticPaths } from 'next';

import { App, AlgoliaPage, DEFAULT_PROPS } from '../../page-components/search-page';

// If you wanted to pre-render some pages, then this is the place to do that
// here is one example
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: {
          // yarn build && yarn start => http://localhost:3000/categories/Cell%20Phones 🔥
          // You can use the search bar to further drill down into the category
          // You can disable JS entirely; this is a fully static page
          algoliaCategorySlug: 'Cell Phones'
        }
      }
    ], fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Tell NextJS how to build the query from the data returned from getStaticPaths
  const configure = {
    filters: `categories:'${params.algoliaCategorySlug}'`
  }

  const query = { configure }

  const searchState = query ? qs.parse(query) : {}

  const resultsState = await findResultsState(App, {
    ...DEFAULT_PROPS,
    searchState,
    configure
  });

  console.log('results state', resultsState?.rawResults[0].hits[0].name)

  return {
    props: {
      resultsState: JSON.parse(JSON.stringify(resultsState)),
      initialSearchState: searchState,
      configure
    },
    revalidate: 3600
  };
}

export default withRouter(AlgoliaPage);
