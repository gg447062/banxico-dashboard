import Table from './Table';
import Graph from './Graph';
import { useDispatch } from 'react-redux';
import { remove } from '@/store/visualizations';

export default function Visualization({ input }) {
  const dispatch = useDispatch();
  return (
    <div>
      <button
        onClick={() => {
          dispatch(remove(input.id));
        }}
      >
        X
      </button>
      {input.type === 'table' && <Table input={input} />}
      {input.type === 'graph' && <Graph input={input} />}
    </div>
  );
}
