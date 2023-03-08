import React from 'react';
import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import visualizationSlice from '@/store/visualizations';

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: { visualizations: visualizationSlice },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export const testBarGraph = {
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

export const expectedGraphResult = {
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

export const testTable = {
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

export const expectedTableResult = {
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

export const initialStateWithVisualizations = {
  visualizations: {
    status: 'idle',
    entities: {
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
        startDate: '2023-01-02',
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
      5678: {
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
        id: '5678',
        dateFormat: '',
        decimals: '',
        graphType: 'bar',
        colors: { SF43658: 'pink' },
      },
    },
  },
};
