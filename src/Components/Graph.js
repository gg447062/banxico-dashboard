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
import { useSelector } from 'react-redux';

export default function Graph({ id }) {
  const data = useSelector((state) => state.visualizations.entities[id]);

  const width = 500;
  const height = 400;

  return (
    <div data-testid="graph">
      <h2>{data.title}</h2>
      {data.graphType === 'bar' && (
        <BarChart width={width} height={height} data={data.data}>
          <CartesianGrid strokeDasharray={'1 1'} />
          <XAxis dataKey={'fecha'} />
          <YAxis />
          <Legend />
          <Tooltip />
          {data.selectedSeries.map((el, i) => {
            return <Bar key={i} dataKey={el} fill={data.colors[el]} />;
          })}
        </BarChart>
      )}
      {data.graphType === 'line' && (
        <LineChart width={width} height={height} data={data.data}>
          <CartesianGrid strokeDasharray={'1 1'} />
          <XAxis dataKey={'fecha'} />
          <YAxis />
          <Legend />
          <Tooltip />
          {data.selectedSeries.map((el, i) => {
            return (
              <Line
                key={i}
                type="monotone"
                dataKey={el}
                stroke={data.colors[el]}
              />
            );
          })}
        </LineChart>
      )}
      {data.graphType === 'area' && (
        <AreaChart width={width} height={height} data={data.data}>
          <CartesianGrid strokeDasharray={'1 1'} />
          <XAxis dataKey={'fecha'} />
          <YAxis />
          <Legend />
          <Tooltip />
          {data.selectedSeries.map((el, i) => {
            return (
              <Area
                key={i}
                type="monotone"
                dataKey={el}
                stroke={data.colors[el]}
                fill={data.colors[el]}
                fillOpacity={0.5}
              />
            );
          })}
        </AreaChart>
      )}
    </div>
  );
}
