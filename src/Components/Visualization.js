import Table from './Table';
import Graph from './Graph';
import { useDispatch } from 'react-redux';
import { remove } from '@/store/visualizations';
import Button from './Button';
import styles from '@/styles/Visualization.module.css';

export default function Visualization({
  id,
  title,
  type,
  setCurrentVisualization,
  openEditModal,
}) {
  const dispatch = useDispatch();

  function handleClick() {
    setCurrentVisualization(id);
    openEditModal();
  }
  return (
    <div data-testid="visualization" className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.buttons}>
          <Button onClick={handleClick} text="Edit" type="edit" />
          <Button
            onClick={() => {
              dispatch(remove(id));
            }}
            text="X"
            label="remove-visualization"
            type="cancel"
          />
        </div>
      </div>

      {type === 'table' && <Table id={id} />}
      {type === 'graph' && <Graph id={id} />}
    </div>
  );
}
