import {
  RefinementList,
  SearchBox,
  Hits,
  Configure,
  Pagination,
  InstantSearch,
} from 'react-instantsearch-dom';

import { HitComponent } from './hit'

export default function App({
  searchClient,
  resultsState,
  onSearchStateChange,
  searchState,
  createURL,
  indexName,
  onSearchParameters,
  configure,
  ...rest
}: any) {
  console.group('In Component')
  console.info('Props', { searchState, resultsState, configure })
  console.groupEnd()
  console.groupEnd()
  return (
    <InstantSearch
      searchClient={searchClient}
      resultsState={resultsState}
      onSearchStateChange={onSearchStateChange}
      searchState={searchState}
      createURL={createURL}
      indexName={indexName}
      onSearchParameters={onSearchParameters}
      {...rest}
    >
      {
        /*
          Spread the configure used on server/static rendered pages into the mounted
          component to avoid a repaint on load.
        */
      }
      <Configure {...configure} />
      <header>
        <h1>React InstantSearch + Next.Js</h1>
        <SearchBox />
      </header>
      <main>
        <div className="results">
          <Hits hitComponent={HitComponent} />
        </div>
      </main>
      <footer>
        <br />
        <Pagination />
      </footer>
    </InstantSearch>
  )
}
