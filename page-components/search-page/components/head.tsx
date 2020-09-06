import NextHead from 'next/head';

export const Head = () => (
  <NextHead>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/instantsearch.css@7.0.0/themes/algolia-min.css"
    />
    <link rel="stylesheet" href="instantsearch.css" />
  </NextHead>
);

export default Head;
