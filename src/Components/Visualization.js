import Table from './Table';
import Graph from './Graph';
import { useDispatch } from 'react-redux';
import { remove } from '@/store/visualizations';

export default function Visualization({
  id,
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
    <div>
      <button
        onClick={() => {
          dispatch(remove(id));
        }}
      >
        X
      </button>
      <button onClick={handleClick}>Edit</button>
      {type === 'table' && <Table id={id} />}
      {type === 'graph' && <Graph id={id} />}
    </div>
  );
}
