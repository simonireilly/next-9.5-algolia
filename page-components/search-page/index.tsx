import Head from './components/head';
import App from './components/app';
import React, { useState, useEffect } from 'react';
import Link from 'next/link'

import styles from './index.module.css'
import { DEFAULT_PROPS, createURL, pathToSearchState, searchStateToURL } from './lib'
import { Router } from 'next/router';

export { default as App } from './components/app'
export { DEFAULT_PROPS, createURL, searchStateToURL } from './lib'

type SearchState = {
  configure?: {
    filters: string
  }
}

export const AlgoliaPage = (
  {
    resultsState,
    serverSideSearchState = {},
    configure,
    router,
    ...rest
  }: {
    resultsState: any,
    serverSideSearchState: SearchState,
    configure: any,
    router: Router
  }) => {

  console.group('Mounting component');
  const [searchState, setSearchState] = useState(serverSideSearchState)
  const [lastRouter, setLastRouter] = useState(router)

  console.info('Components Props', {
    resultsState,
    serverSideSearchState,
    configure,
    router,
    rest
  })

  console.info('Components State', {
    searchState,
    serverSideSearchState,
    lastRouter
  })

  // Here we ensure that we are binding to changes to the full path and updating the
  // search state from the path if that happens. One issue is that, if you navigate
  // from one category to another the path changes, but you cannot rebuild the search
  // state from the url, its path will not parse into a valid algolia query as we are
  // just mapping a key to the Algolia query we want.
  useEffect(() => {
    console.group('useEffect - router')
    console.log('router', router.asPath)
    console.log('lastRouter', lastRouter.asPath)

    if (lastRouter.asPath !== router.asPath) {
      // The configuration is not stored in the URL as we pluck it in searchStateToURL.
      // We have to do the same here, and ensure that we create the correct search state
      // for the new URL, including our configuration.
      const { configure } = searchState
      const urlSearchState = pathToSearchState(router.asPath)
      const newSearchState = { configure, ...urlSearchState }

      setSearchState(newSearchState)
      setLastRouter(router)
    }
    console.groupEnd()
  }, [lastRouter.asPath, router.asPath]);

  // Here we ensure that we are binding to Next JS ISR isFallback and ensure that
  // when we get a new JSON blob of data, we will re-render the page.
  useEffect(() => {
    console.group('useEffect - fallback')
    console.info('router', router.isFallback)
    console.info('lastRouter', lastRouter.isFallback)

    if (router.isFallback !== lastRouter.isFallback) {
      setSearchState(searchState)
      setLastRouter(router)
    }

    console.groupEnd()
  }, [lastRouter.isFallback, router.isFallback])

  const onSearchStateChange = newSearchState => {
    console.group('onSearchStateChange');
    console.info('Search states', {
      searchState,
      newSearchState
    })

    const href = searchStateToURL(newSearchState);

    console.info('Current path', router.asPath)
    console.info('New Url', href)

    if (router.asPath !== href) {
      router.push(href, href, { shallow: true });
      setSearchState(newSearchState);
    } else {
      console.info('Doing nothing, no URL change')
    }

    console.groupEnd()
  };

  // If you render the InstantSearch component when there is no state yet you are
  // in for trouble. Once mounted it tries to check it was mounted with the same
  // state as the url etc. Best to render a loading image. This will only happen
  // for the first visitor to ISR pages. Then, only HTML will be served. You will
  // rarely see this loading screen after you go live. If you have fully defined
  // `getStaticPaths` in your route, you will never see this loading screen 👍
  if (router.isFallback) {
    { console.info('Rendering Fallback') }
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
  // will do client side navigation, even when you specify shallow=false
  const Routes = () => <>
    <Link href="/" as={`/`} >
      <a>Home</a>
    </Link>
    <Link href={`/server-category/Computers & Tablets`} shallow={false} >
      <a>Server: Computers and Tablets</a>
    </Link>
    <Link href={`/static-category/Computers & Tablets`} shallow={false} >
      <a>Static: Computers and Tablets</a>
    </Link>
  </>

  const Content = ({ searchState: contentSearchState, serverSideSearchState }) => <>
    {console.info('Content', {
      contentSearchState,
      serverSideSearchState
    })}
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

  // When we are navigating client side, we have already mounted to the DOM an Algolia
  // react-instantsearch instance. So, if we send it new data from the NextJS JSON chunk
  // it perceives an internal state change, and makes a request to algolia. Therefore
  // we should instead render an entirely new component.
  //
  // So, searchState as a piece of state is bound, on mount, to searchState prop. We need
  // to also pass in the serverSideSearchState, which is not bound to state. This allows
  // us to resolve the mounted component with serverSideSearchState during client side
  // navigation.
  // return <Content searchState={searchState} serverSideSearchState={serverSideSearchState} />
  return <div className={styles.wrapper}>
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
}
