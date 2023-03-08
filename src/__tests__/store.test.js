import visualizationSlice, {
  initialState,
  fetchSeriesData,
  remove,
} from '@/store/visualizations';
import { store } from '@/store/index';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const testBarGraph = {
  seriesString: 'SF43658',
  startDate: '2023-01-01',
  endDate: '2023-03-08',
  language: 'es',
  type: 'graph',
  title: 'test-graph',
  id: '1234',
  dateFormat: '',
  decimals: '',
  graphType: 'bar',
  colors: { SF43658: 'pink' },
};

const testGraphResult = {
  1234: {
    data: [
      { SF43658: 3876663.0, fecha: '30/12/2022' },
      { SF43658: 3829690.1, fecha: '06/01/2023' },
      { SF43658: 3770091.8, fecha: '13/01/2023' },
      { SF43658: 3801964.3, fecha: '20/01/2023' },
      { SF43658: 3776123.6, fecha: '27/01/2023' },
      { SF43658: 3802009.1, fecha: '03/02/2023' },
      { SF43658: 3750742.6, fecha: '10/02/2023' },
      { SF43658: 3689728.7, fecha: '17/02/2023' },
      { SF43658: 3681990.5, fecha: '24/02/2023' },
      { SF43658: 3607278.8, fecha: '03/03/2023' },
    ],
    titlesList: [
      'Principales renglones del estado de cuenta del Banco de México.- Activo Reserva Internacional',
    ],
    selectedSeries: ['SF43658'],
    startDate: '2023-01-01',
    endDate: '2023-03-08',
    language: 'es',
    type: 'graph',
    title: 'test-graph',
    id: '1234',
    dateFormat: '',
    decimals: '',
    graphType: 'bar',
    colors: { SF43658: 'pink' },
  },
};

const testTable = {
  seriesString: 'SF43658',
  startDate: '2023-01-01',
  endDate: '2023-03-08',
  language: 'es',
  type: 'table',
  title: 'test-table',
  id: '1234',
  dateFormat: 'mm/dd/yyyy',
  decimals: '1',
  graphType: '',
  colors: {},
};

const testTableResult = {
  1234: {
    data: [
      { datos: ['3876663.0'], fecha: '12/30/2022' },
      { datos: ['3829690.1'], fecha: '01/06/2023' },
      { datos: ['3770091.8'], fecha: '01/13/2023' },
      { datos: ['3801964.3'], fecha: '01/20/2023' },
      { datos: ['3776123.6'], fecha: '01/27/2023' },
      { datos: ['3802009.1'], fecha: '02/03/2023' },
      { datos: ['3750742.6'], fecha: '02/10/2023' },
      { datos: ['3689728.7'], fecha: '02/17/2023' },
      { datos: ['3681990.5'], fecha: '02/24/2023' },
      { datos: ['3607278.8'], fecha: '03/03/2023' },
    ],
    titlesList: [
      'Principales renglones del estado de cuenta del Banco de México.- Activo Reserva Internacional',
    ],
    selectedSeries: ['SF43658'],
    startDate: '2023-01-01',
    endDate: '2023-03-08',
    language: 'es',
    type: 'table',
    title: 'test-table',
    id: '1234',
    dateFormat: 'mm/dd/yyyy',
    decimals: '1',
    graphType: '',
    colors: {},
  },
};

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

describe('redux store', () => {
  it('initializes store with intial state', () => {
    const visualizationSliceInit = visualizationSlice(initialState, {
      type: 'unknown',
    });
    expect(visualizationSliceInit).toBe(initialState);
  });

  it('fetches data from the api and adds a visualization to the store', async () => {
    await store.dispatch(fetchSeriesData(testBarGraph));

    const state = store.getState().visualizations.entities;
    expect(state).toEqual(testGraphResult);
  });

  it('updates a current entity', async () => {
    await store.dispatch(fetchSeriesData(testBarGraph));

    let state = store.getState().visualizations.entities;
    expect(state).toEqual(testGraphResult);

    await store.dispatch(fetchSeriesData(testTable));

    state = store.getState().visualizations.entities;
    expect(state).toEqual(testTableResult);
  });

  it('deletes a visualization from the store', async () => {
    await store.dispatch(fetchSeriesData(testBarGraph));

    let state = store.getState().visualizations.entities;
    expect(state).toEqual(testGraphResult);

    store.dispatch(remove('1234'));

    state = store.getState().visualizations.entities;
    expect(state).toEqual({});
  });
});
