import { pathToSearchState, searchStateToURL } from "../page-components/search-page/lib"


describe('Constructing state from URLs', () => {
  it('creates a URL from a search state', () => {
    const searchState = {
      refinementList: { categories: ['Appliances'] },
      page: '1',
      configure: { hitsPerPage: '12' },
      query: 'assd'
    }

    const newSearchState = pathToSearchState(searchStateToURL(searchState))

    expect(newSearchState).toEqual(
      expect.objectContaining({
        refinementList: { categories: ['Appliances'] },
        page: '1',
        configure: { hitsPerPage: '12' },
        query: 'assd'
      })
    )
  })

  it('creates a category search state from a url', () => {
    const searchState = pathToSearchState('http://localhost:3000/categories/Appliances')

    expect(searchState).toEqual(
      expect.objectContaining({
        configure: { filters: 'categories:Appliances' }
      })
    )
  })

  it('creates a search state from a url', () => {
    const searchState = pathToSearchState('http://localhost:3000/?query=as&page=2&configure%5BhitsPerPage%5D=12&refinementList%5Bcategories%5D%5B0%5D=All%20Refrigerators')

    expect(searchState).toEqual(
      expect.objectContaining({
        query: 'as',
        page: '2',
        configure: { hitsPerPage: '12' },
        refinementList: { categories: ['All Refrigerators'] }
      })
    )
  })
})
