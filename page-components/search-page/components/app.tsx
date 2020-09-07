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
  filters,
  ...rest
}: any) {
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
      <Configure hitsPerPage={12} filters={filters} />
      <header>
        <h1>React InstantSearch + Next.Js</h1>
        <SearchBox />
      </header>
      <main>
        <div className="menu">
          <RefinementList attribute="categories" />
        </div>
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
