import { BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar } from 'recharts';
import { useEffect, useState } from 'react';

export default function Graph({ input }) {
  const [data, setData] = useState();

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
    <BarChart width={400} height={300} data={data}>
      <CartesianGrid strokeDasharray={'1 1'} />
      <XAxis dataKey={'fecha'} />
      <YAxis />
      <Legend />
      {input.data.map((el, i) => {
        return <Bar key={i} dataKey={el.idSerie} fill="#1884d8" />;
      })}
    </BarChart>
  );
}
