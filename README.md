# GitHub GraphQL API Explorer

__**TL;DR This is just for my practice, don't use it. Use [GitHub's](https://docs.github.com/en/graphql/overview/explorer).**__

This app runs the wonderful [GraphiQL UI](https://github.com/graphql/graphiql/tree/main/packages/graphiql) to talk to [GitHub's GraphQL API](https://docs.github.com/en/graphql).

## Dependencies

* Node 18
* [direnv](https://github.com/direnv/direnv)

## Setup

1. Bootstap your `.envrc` file.
   ```
   cp .envrc.sample .envrc
   ```
1. Fill out your `.envrc` file.
1. Install packages.
   ```
   npm install
   ```

## Run

1. Run the app.
   ```
   npm run start
   ```

See the `"scripts"` entry in the [`package.json`](package.json) for more commands.
