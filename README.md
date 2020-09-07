# Introduction

NextJS has introduced super methods for creating server side and static content. This GitHUb repo is an attempt to showcase these methods hand-in-hand with Algolia react-instantsearch library.

The source code has extensive comments, so I would recommend reading them, starting in the `pages` directory.

- [Introduction](#introduction)
  - [Step Through Tutorial](#step-through-tutorial)
    - [First Page](#first-page)

## Step Through Tutorial

First, lets use typescript

```
touch tsconfig.json

yarn add --dev typescript @types/react @types/node

```

Now add some algolia:

```
yarn add algoliasearch react-instantsearch-dom
```

### First Page

We want to do server side rendering with algolia so first lets create a `pages/index.tsx`

