import {
  BarChart,
  LineChart,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Bar,
  Line,
  Area,
  Tooltip,
} from 'recharts';
import { useEffect, useState } from 'react';

export default function Graph({ input, type = 'bar' }) {
  const [data, setData] = useState();
  const width = 500;
  const height = 400;

  useEffect(() => {
    function processData() {
      const _data = [];
      input.data.forEach((el, i) => {
        const id = el.idSerie;
        el.datos.forEach((dato, j) => {
          if (i === 0) {
            _data.push({
              fecha: dato.fecha,
              [id]: parseFloat(dato.dato.split(',').join('')),
            });
          } else {
            _data[j][id] = parseFloat(dato.dato.split(',').join(''));
          }
        });
      });
      setData(_data);
    }

    if (!data) {
      processData();
    }
  }, [data, input.data]);

  return (
    <div>
      <h2>{input.title}</h2>
      {type === 'bar' && (
        <BarChart width={width} height={height} data={data}>
          <CartesianGrid strokeDasharray={'1 1'} />
          <XAxis dataKey={'fecha'} />
          <YAxis />
          <Legend />
          <Tooltip />
          {input.data.map((el, i) => {
            return (
              <Bar
                key={i}
                dataKey={el.idSerie}
                fill={input.colors[el.idSerie]}
              />
            );
          })}
        </BarChart>
      )}
      {type === 'line' && (
        <LineChart width={width} height={height} data={data}>
          <CartesianGrid strokeDasharray={'1 1'} />
          <XAxis dataKey={'fecha'} />
          <YAxis />
          <Legend />
          <Tooltip />
          {input.data.map((el, i) => {
            return (
              <Line
                key={i}
                type="monotone"
                dataKey={el.idSerie}
                stroke={input.colors[el.idSerie]}
              />
            );
          })}
        </LineChart>
      )}
      {type === 'area' && (
        <AreaChart width={width} height={height} data={data}>
          <CartesianGrid strokeDasharray={'1 1'} />
          <XAxis dataKey={'fecha'} />
          <YAxis />
          <Legend />
          <Tooltip />
          {input.data.map((el, i) => {
            return (
              <Area
                key={i}
                type="monotone"
                dataKey={el.idSerie}
                stroke={input.colors[el.idSerie]}
                fill={input.colors[el.idSerie]}
                fillOpacity={0.5}
              />
            );
          })}
        </AreaChart>
      )}
    </div>
  );
}
