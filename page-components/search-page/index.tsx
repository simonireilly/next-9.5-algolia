import Head from './components/head';
import App from './components/app';
import React, { useState, useEffect } from 'react';
import Link from 'next/link'

import styles from './index.module.css'
import { DEFAULT_PROPS, createURL, pathToSearchState, searchStateToURL } from './lib'

export { default as App } from './components/app'
export { DEFAULT_PROPS, createURL, searchStateToURL } from './lib'

export const AlgoliaPage = ({ resultsState, initialSearchState = {}, configure, router }) => {

  const [searchState, setSearchState] = useState(initialSearchState)
  const [lastRouter, setLastRouter] = useState(router)
  console.log('Mounting component', initialSearchState)
  console.log('Mounting search state', searchState)
  console.log('Mounting configure', configure)


  // Here we ensure that we are binding to changes to the full path and updating the
  // search state from the path if that happens. One issue is that, if you navigate
  // from one category to another the path changes, but you cannot rebuild the search
  // state from the url, its path will not parse into a valid algolia query as we are
  // just mapping a key to the Algolia query we want.
  useEffect(() => {
    if (lastRouter.asPath !== router.asPath) {
      setSearchState(pathToSearchState(router.asPath))
      setLastRouter(router)
    }
  }, [lastRouter.asPath, router.asPath]);

  // Here we ensure that we are binding to Next JS ISR isFallback and ensure that
  // when we get a new JSON blob of data, we will re-render the page.
  useEffect(() => {
    console.log('useEffect - fallback', router.isFallback !== lastRouter.isFallback)
    if (router.isFallback !== lastRouter.isFallback) {
      setSearchState(initialSearchState)
    }
  }, [lastRouter.isFallback, router.isFallback])

  const onSearchStateChange = newSearchState => {
    console.log('oldSearchState', searchState)
    console.log('newSearchState', newSearchState)

    const href = searchStateToURL(newSearchState);

    console.log('Current path', router.asPath)
    console.log('New Url', href)
    if (router.asPath !== href) {
      router.push(href, href, { shallow: true });
    }

    console.warn('Set Search State', newSearchState)
    setSearchState(newSearchState);
  };

  // If you render the InstantSearch component when there is no state yet you are
  // in for trouble. Once mounted it tries to check it was mounted with the same
  // state as the url etc. Best to render a loading image. This will only happen
  // for the first visitor to ISR pages. Then, only HTML will be served. You will
  // rarely see this loading screen after you go live. If you have fully defined
  // `getStaticPaths` in your route, you will never see this loading screen 👍
  if (router.isFallback) {
    return <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh'
    }}>
      <h1>Loading Static Search Results</h1>
    </div>
  }

  // These routes are going to cause you some problems. Although next renders all
  // static pages it will perform shallow routing if the page is not actually `different`
  //  e.g. `/pages/categories/[algoliaCategorySlug]` is always the same. Next knows this and
  // will do client side migration, even when you specify shallow={false}
  const Routes = () => <>
    <Link href="/" as={`/`} shallow={false}>
      <a>Home</a>
    </Link>
    <Link href="/categories/[algoliaCategorySlug]" as={`/categories/Computers & Tablets`} shallow={false}>
      <a>Computers and Tablets</a>
    </Link>
    <Link href="/categories/[algoliaCategorySlug]" as={`/categories/Appliances`} shallow={false}>
      <a>Appliances</a>
    </Link>
    <Link href="/categories/[algoliaCategorySlug]" as={`/categories/Cell Phone Accessories`} shallow={false}>
      <a>Cell Phone Accessories</a>
    </Link>
  </>

  return (
    <>
      <div className={styles.wrapper}>
        <Head />
        <div style={{
          display: 'flex',
          padding: '10px',
          justifyContent: 'space-around'
        }}>
          <Routes />
        </div>
        <App
          {...DEFAULT_PROPS}
          searchState={searchState}
          resultsState={resultsState}
          onSearchStateChange={onSearchStateChange}
          createURL={createURL}
          configure={configure}
        />
      </div>
    </>
  );
}
