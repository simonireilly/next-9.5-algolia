import Head from './components/head';
import App from './components/app';
import React, { useState, useEffect } from 'react';

import styles from './index.module.css'
import { DEFAULT_PROPS, createURL, pathToSearchState, searchStateToURL } from './lib/utils'

export { default as App } from './components/app'
export { DEFAULT_PROPS, createURL, searchStateToURL } from './lib/utils'

export const AlgoliaPage = ({ resultsState, initialSearchState = {}, router }) => {
  const [searchState, setSearchState] = useState(initialSearchState)
  const [lastRouter, setLastRouter] = useState(router)

  useEffect(() => {
    if (lastRouter.asPath !== router.asPath) {
      setSearchState(pathToSearchState(router.asPath))
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
        <App
          {...DEFAULT_PROPS}
          searchState={searchState}
          resultsState={resultsState}
          onSearchStateChange={onSearchStateChange}
          createURL={createURL}
        />
      </div>
    </>
  );
}
