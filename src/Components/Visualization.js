import Table from './Table';
import Graph from './Graph';
import { useDispatch } from 'react-redux';
import { remove } from '@/store/visualizations';
import Button from './Button';

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
    <div data-testid="visualization">
      <Button
        onClick={() => {
          dispatch(remove(id));
        }}
        text="X"
        label="remove-visualization"
        type="cancel"
      />
      <Button onClick={handleClick} text="Edit" type="primary" />

      {type === 'table' && <Table id={id} />}
      {type === 'graph' && <Graph id={id} />}
    </div>
  );
}
