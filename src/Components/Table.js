import styles from '@/styles/Table.module.css';
import { useEffect, useState } from 'react';

function Row({ input }) {
  return (
    <tr>
      <td className={styles.td}>{input.fecha}</td>
      {input.datos.map((dato, i) => {
        return (
          <td key={i} className={styles.td}>
            {dato}
          </td>
        );
      })}
    </tr>
  );
}

export default function Table({ input }) {
  const [data, setData] = useState();
  const [titles, setTitles] = useState();

  function adjustDecimals(val) {
    return parseFloat(val.split(',').join('')).toFixed(input.decimals);
  }

  useEffect(() => {
    function processData() {
      const _data = [];
      const _titles = [];
      input.data.forEach((el, i) => {
        _titles.push(el.titulo);
        el.datos.forEach((dato, j) => {
          const adjustedData = adjustDecimals(dato.dato);
          if (i === 0) {
            _data.push({
              fecha: dato.fecha,
              datos: [adjustedData],
            });
          } else {
            _data[j].datos.push(adjustedData);
          }
        });
      });
      setData(_data);
      setTitles(_titles);
    }

    if (!data && !titles) {
      processData();
    }
  }, [data, titles, input.data, input.decimals]);
  return (
    <div>
      <table className={styles.table}>
        <caption>{input.title}</caption>
        <thead>
          <tr>
            <th className={styles.th}></th>
            {titles &&
              titles.map((el, i) => {
                return (
                  <th key={i} className={styles.th}>
                    {el}
                  </th>
                );
              })}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((el, i) => {
              return <Row key={i} input={el} />;
            })}
        </tbody>
      </table>
    </div>
  );
}
