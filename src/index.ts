import { createServer, type RequestListener } from 'node:http';

import waitOn from 'wait-on';
import { createYoga } from 'graphql-yoga';
import { loadSchema } from '@graphql-tools/load';
import { UrlLoader } from '@graphql-tools/url-loader';

import logger from './logger';

function getEnvironmentVariable(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} environment variable is not set.`);
  }

  return value;
}

interface Headers {
  authorization: string;
}

async function prepareUrl(environmentVariable: string, headers: Headers): Promise<string> {
  const url = getEnvironmentVariable(environmentVariable);

  logger.info(`Attempting to talk to ${environmentVariable} on`, url);
  await waitOn({ resources: [url], headers });
  logger.info(`Talking to ${environmentVariable} on`, url);

  return url;
}

async function fetchSchema() {
  const githubApiToken = getEnvironmentVariable('GITHUB_API_TOKEN');
  const userAgent = getEnvironmentVariable('USER_AGENT');
  const headers = { authorization: `Bearer ${githubApiToken}`, 'user-agent': userAgent };
  const githubApiEndpoint = await prepareUrl('GITHUB_API_URL', headers);
  return await loadSchema(githubApiEndpoint, { loaders: [new UrlLoader()], headers });
}

// If https://github.com/ardatan/whatwg-node/issues/391 gets resolved, we can
// delete this use of `as`.
//
// See https://github.com/dotansimha/graphql-yoga/discussions/2818 for more
// context. Rather than disable the `exactOptionalPropertyTypes` compiler flag
// or use a `@ts-expect-error`, I'm sledge-hammering some types together with
// `as`.
const app = createYoga({ schema: fetchSchema() }) as RequestListener;
const server = createServer(app);
const defaultPort = 4000;
const port = process.env['GATEWAY_ONE_PORT'] ?? defaultPort;

server.listen(port, () => {
  logger.info(`App running at http://localhost:${port}/graphql`);
});
