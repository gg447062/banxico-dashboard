import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const initialState = {
  status: 'idle',
  entities: {},
};

export const fetchSeriesData = createAsyncThunk(
  'visualizations/fetchSeriesData',
  async (obj) => {
    const dateString = obj.startDate ? `${obj.startDate}/${obj.endDate}` : '';

    const { data } = await axios.get(
      `https://5i8qcjp333.execute-api.us-east-1.amazonaws.com/dev/series/${obj.seriesString}/${dateString}?locale=${obj.language}`,
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_TUKAN_TOKEN,
          'Bmx-Token': process.env.NEXT_PUBLIC_BANXICO_TOKEN,
        },
      }
    );

    function adjustDecimals(val) {
      return parseFloat(val.split(',').join('')).toFixed(obj.decimals);
    }

    function adjustDate(date) {
      if (obj.type === 'graph' || obj.dateFormat === 'dd/mm/yyyy') {
        return date;
      }

      const dateParts = date.split('/');

      if (obj.dateFormat === 'mm/dd/yyyy') {
        return `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`;
      } else if (obj.dateFormat === 'yyyy/dd/mm') {
        return `${dateParts[2]}/${dateParts[0]}/${dateParts[1]}`;
      }
    }

    const processedData = [];
    const titlesList = data.bmx.series.map((el) => el.titulo);
    if (obj.type === 'graph') {
      data.bmx.series.forEach((el, i) => {
        const id = el.idSerie;
        el.datos.forEach((dato, j) => {
          if (i === 0) {
            processedData.push({
              fecha: dato.fecha,
              [id]: parseFloat(dato.dato.split(',').join('')),
            });
          } else {
            processedData[j][id] = parseFloat(dato.dato.split(',').join(''));
          }
        });
      });
    } else {
      data.bmx.series.forEach((el, i) => {
        el.datos.forEach((dato, j) => {
          const adjustedData = adjustDecimals(dato.dato);
          if (i === 0) {
            processedData.push({
              fecha: adjustDate(dato.fecha),
              datos: [adjustedData],
            });
          } else {
            processedData[j].datos.push(adjustedData);
          }
        });
      });
    }

    return {
      data: processedData,
      titlesList: titlesList,
      selectedSeries: obj.seriesString.split(','),
      startDate: obj.startDate,
      endDate: obj.endDate,
      language: obj.language,
      type: obj.type,
      title: obj.title,
      id: obj.id,
      dateFormat: obj.dateFormat,
      decimals: obj.decimals,
      graphType: obj.graphType,
      colors: obj.colors,
    };
  }
);

export const visualizationSlice = createSlice({
  name: 'visualizations',
  initialState,
  reducers: {
    remove: (state, action) => {
      delete state.entities[action.payload];
    },
    set: (state, action) => {
      state.entities = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSeriesData.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchSeriesData.fulfilled, (state, action) => {
      state.entities[action.payload.id] = action.payload;
      state.status = 'idle';
    });
  },
});

export const { remove, set } = visualizationSlice.actions;

export default visualizationSlice.reducer;
