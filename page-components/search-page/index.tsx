import Head from './components/head';
import App from './components/app';
import React, { useState, useEffect } from 'react';
import Link from 'next/link'

import styles from './index.module.css'
import { DEFAULT_PROPS, createURL, pathToSearchState, searchStateToURL } from './lib'

export { default as App } from './components/app'
export { DEFAULT_PROPS, createURL, searchStateToURL } from './lib'

export const AlgoliaPage = ({ resultsState, initialSearchState = {}, router, filters }) => {
  const [searchState, setSearchState] = useState(initialSearchState)
  const [lastRouter, setLastRouter] = useState(router)

  // Here we ensure that we are binding to changes to the full path and updating the
  // search state from the path if that happens. One issue is that, if you navigate
  // from one category to another the path changes, but you cannot rebuild the search
  // state from the url, its path will not parse into a valid algolia query as we are
  // just mapping a key to the Algolia query we want.
  useEffect(() => {
    if (lastRouter.asPath !== router.asPath) {
      setSearchState(pathToSearchState(router))
      setLastRouter(router)
    }
  }, [lastRouter.asPath, router.asPath]);

  // Here we ensure that we are binding to Next JS ISR isFallback and ensure that
  // when we get a new JSON blob of data, we will re-render the page.
  useEffect(() => {
    if (router.isFallback !== lastRouter.isFallback) {
      setSearchState(initialSearchState)
    }
  }, [lastRouter.isFallback, router.isFallback])

  const onSearchStateChange = searchState => {
    const href = searchStateToURL(searchState);

    router.push(href, href, { shallow: true });

    setSearchState(searchState);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <Head />
        <div style={{
          display: 'flex',
          padding: '10px',
          justifyContent: 'space-around'
        }}>
          <Link href="/categories/[algoliaCategorySlug]" as={`/categories/Computers & Tablets`} shallow={false}>
            <a>Computers and Tablets</a>
          </Link>
          <Link href="/categories/[algoliaCategorySlug]" as={`/categories/Cell Phone Accessories`} shallow={false}>
            <a>Cell Phone Accessories</a>
          </Link>
        </div>
        <App
          {...DEFAULT_PROPS}
          searchState={searchState}
          resultsState={resultsState}
          onSearchStateChange={onSearchStateChange}
          createURL={createURL}
          filters={filters}
        />
      </div>
    </>
  );
}
