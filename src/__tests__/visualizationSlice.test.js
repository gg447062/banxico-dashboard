import visualizationSlice, {
  initialState,
  fetchSeriesData,
  remove,
} from '@/store/visualizations';
import { store } from '@/store/index';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  testTable,
  testBarGraph,
  expectedTableResult,
  expectedGraphResult,
} from '../lib/utils/test_utils';

const handlers = [
  rest.get(
    `https://5i8qcjp333.execute-api.us-east-1.amazonaws.com/dev/series/SF43658/2023-01-01/2023-03-08`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          bmx: {
            series: [
              {
                datos: [
                  { fecha: '30/12/2022', dato: '3,876,663.0' },
                  { fecha: '06/01/2023', dato: '3,829,690.1' },
                  { fecha: '13/01/2023', dato: '3,770,091.8' },
                  { fecha: '20/01/2023', dato: '3,801,964.3' },
                  { fecha: '27/01/2023', dato: '3,776,123.6' },
                  { fecha: '03/02/2023', dato: '3,802,009.1' },
                  { fecha: '10/02/2023', dato: '3,750,742.6' },
                  { fecha: '17/02/2023', dato: '3,689,728.7' },
                  { fecha: '24/02/2023', dato: '3,681,990.5' },
                  { fecha: '03/03/2023', dato: '3,607,278.8' },
                ],
                idSerie: 'SF43658',
                titulo:
                  'Principales renglones del estado de cuenta del Banco de México.- Activo Reserva Internacional',
              },
            ],
          },
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

describe('visualization slice', () => {
  it('initializes store with initial state', () => {
    const visualizationSliceInit = visualizationSlice(initialState, {
      type: 'unknown',
    });
    expect(visualizationSliceInit).toBe(initialState);
  });

  it('fetches data from the api and adds a visualization to the store', async () => {
    await store.dispatch(fetchSeriesData(testBarGraph));

    const state = store.getState().visualizations.entities;
    expect(state).toEqual(expectedGraphResult);
  });

  it('updates a current entity', async () => {
    await store.dispatch(fetchSeriesData(testBarGraph));

    let state = store.getState().visualizations.entities;
    expect(state).toEqual(expectedGraphResult);

    await store.dispatch(fetchSeriesData(testTable));

    state = store.getState().visualizations.entities;
    expect(state).toEqual(expectedTableResult);
  });

  it('deletes a visualization from the store', async () => {
    await store.dispatch(fetchSeriesData(testBarGraph));

    let state = store.getState().visualizations.entities;
    expect(state).toEqual(expectedGraphResult);

    store.dispatch(remove('1234'));

    state = store.getState().visualizations.entities;
    expect(state).toEqual({});
  });
});
