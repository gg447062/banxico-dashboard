import catalogSlice, {
  initialState,
  fetchSeriesCatalog,
} from '@/store/catalog';
import { store } from '@/store/index';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { expectedCatalogEntry } from '../lib/utils/test_utils';

const handlers = [
  rest.get(
    `https://5i8qcjp333.execute-api.us-east-1.amazonaws.com/dev/series/`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: [
            { variable: '1', display_name: 'one' },
            { variable: '2', display_name: 'two' },
            { variable: '3', display_name: 'three' },
            { variable: '4', display_name: 'four' },
          ],
          page: 1,
          pageSize: 10,
          totalPages: 66,
        }),
        ctx.delay(150)
      );
    }
  ),
];
const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('catalog slice', () => {
  it('initializes store with initial state', () => {
    const catalogSliceInit = catalogSlice(initialState, {
      type: 'unknown',
    });
    expect(catalogSliceInit).toBe(initialState);
  });

  it('fetches data from the api and adds a page to the store', async () => {
    await store.dispatch(fetchSeriesCatalog({ page: 1, query: '' }));

    const state = store.getState().catalog.entities;
    expect(state).toEqual(expectedCatalogEntry);
  });

  it('correctly updates total pages', async () => {
    await store.dispatch(fetchSeriesCatalog({ page: 1, query: '' }));

    const totalPages = store.getState().catalog.totalPages;
    expect(totalPages).toBe(66);
  });

  it('correctly assigns data to entity by pageId', async () => {
    const { payload } = await store.dispatch(
      fetchSeriesCatalog({ page: 1, query: '' })
    );

    const state = store.getState().catalog.entities;

    expect(state).toHaveProperty(`${payload.pageId}`);
  });
});
