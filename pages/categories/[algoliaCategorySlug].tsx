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
  const query = {
    refinementList: {
      categories: params.algoliaCategorySlug
    }
  }

  const searchState = query ? qs.parse(query) : {}

  const resultsState = await findResultsState(App, {
    ...DEFAULT_PROPS,
    searchState,
  });

  return {
    props: {
      resultsState: JSON.parse(JSON.stringify(resultsState)),
      initialSearchState: searchState
    },
    revalidate: 3600
  };
}

export default withRouter(AlgoliaPage);
