import styles from '@/styles/Table.module.css';

function Column({ input, date = false }) {
  return (
    <div className={styles.column}>
      <div className={styles.head}>{date ? '' : input.titulo}</div>
      {input.datos.map((el, i) => {
        return (
          <div key={i} className={styles.row}>
            {date ? el['fecha'] : el['dato']}
          </div>
        );
      })}
    </div>
  );
}

export default function Table({ el }) {
  return (
    <div>
      <h2 className={styles.bold}>{el.title}</h2>
      <div className={styles.body}>
        <Column input={el.data[0]} date={true}></Column>
        {el.data.map((data, i) => {
          return <Column key={i} input={data}></Column>;
        })}
      </div>
    </div>
  );
}
