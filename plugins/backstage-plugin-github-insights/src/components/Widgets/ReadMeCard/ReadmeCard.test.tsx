/*
 * Copyright 2020 RoadieHQ
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { render } from '@testing-library/react';
import {
  ApiRegistry,
  ApiProvider,
  configApiRef,
  githubAuthApiRef,
} from '@backstage/core';
import { rest } from 'msw';
import { msw, wrapInTestApp } from '@backstage/test-utils';
import { setupServer } from 'msw/node';
import { entityMock, readmeResponseMock } from '../../../mocks/mocks';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import { ReadMeCard } from '..';
import { EntityProvider } from "@backstage/plugin-catalog-react";

const mockGithubAuth = {
  getAccessToken: async (_: string[]) => 'test-token',
};

const config = {
  getOptionalConfigArray: (_: string) => [
    { getOptionalString: (_2: string) => undefined },
  ],
};

const apis = ApiRegistry.from([
  [githubAuthApiRef, mockGithubAuth],
  [configApiRef, config],
]);

describe('ReadmeCard', () => {
  const worker = setupServer();
  msw.setupDefaultHandlers(worker);

  beforeEach(() => {
    worker.use(
      rest.get(
        'https://api.github.com/repos/mcalus3/backstage/readme',
        (_, res, ctx) => res(ctx.json(readmeResponseMock))
      )
    );
  });

  it('should display a card with the data from the requests', async () => {
    const rendered = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <ThemeProvider theme={lightTheme}>
            <EntityProvider entity={entityMock}>
              <ReadMeCard />
            </EntityProvider>
          </ThemeProvider>
        </ApiProvider>
      )
    );
    expect(
      await rendered.findByText(
        'Backstage unifies all your infrastructure tooling, services, and documentation to create a streamlined development environment from end to end.'
      )
    ).toBeInTheDocument();
  });
  it('should render unicode correctly', async () => {
    const rendered = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <ThemeProvider theme={lightTheme}>
            <EntityProvider entity={entityMock}>
              <ReadMeCard />
            </EntityProvider>
          </ThemeProvider>
        </ApiProvider>
      )
    );
    expect(
      await rendered.findByText('⭐', { exact: false })
    ).toBeInTheDocument();
  });
  it('should render techdocs links correctly', async () => {
    const rendered = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <ThemeProvider theme={lightTheme}>
            <EntityProvider entity={entityMock}>
              <ReadMeCard />
            </EntityProvider>
          </ThemeProvider>
        </ApiProvider>
      )
    );
    expect(await rendered.findByText('TechDocs Test Link')).toHaveAttribute(
      'href', 'docs/overview/what-is-backstage/',
    );
  });
  it('should render images and add headlines correctly', async () => {
    const rendered = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <ThemeProvider theme={lightTheme}>
            <EntityProvider entity={entityMock}>
              <ReadMeCard />
            </EntityProvider>
          </ThemeProvider>
        </ApiProvider>
      )
    );
    expect(await rendered.findByAltText('headline')).toBeInTheDocument();
  });
  it('should render images and add title correctly', async () => {
    const rendered = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <ThemeProvider theme={lightTheme}>
            <EntityProvider entity={entityMock}>
              <ReadMeCard />
            </EntityProvider>
          </ThemeProvider>
        </ApiProvider>
      )
    );
    expect(await rendered.findByAltText('alt-text')).toHaveAttribute(
      'title', 'cc some-title',
    );
  });
  it('should check image not to have title', async () => {
    const rendered = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <ThemeProvider theme={lightTheme}>
            <EntityProvider entity={entityMock}>
              <ReadMeCard />
            </EntityProvider>
          </ThemeProvider>
        </ApiProvider>
      )
    );
    expect(await rendered.findByAltText('headline')).not.toHaveAttribute(
      'title', 'cc some-title',
    );
  });
  it('should render images url correctly', async () => {
    const rendered = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <ThemeProvider theme={lightTheme}>
            <EntityProvider entity={entityMock}>
              <ReadMeCard />
            </EntityProvider>
          </ThemeProvider>
        </ApiProvider>
      )
    );
    expect(await rendered.findByAltText('headline')).toHaveAttribute(
      'src', '//github.com/mcalus3/backstage/raw/master/docs/assets/headline.png',
    );
  });
});