import styles from '@/styles/Table.module.css';
import { useSelector } from 'react-redux';

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

export default function Table({ id }) {
  const data = useSelector((state) => state.visualizations.entities[id]);

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}></th>
            {data.titlesList &&
              data.titlesList.map((el, i) => {
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
            data.data.map((el, i) => {
              return <Row key={i} input={el} />;
            })}
        </tbody>
      </table>
    </div>
  );
}
