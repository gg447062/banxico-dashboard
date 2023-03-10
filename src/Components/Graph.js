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
  ResponsiveContainer,
} from 'recharts';
import { useSelector } from 'react-redux';
import styles from '@/styles/Graph.module.css';

export default function Graph({ id }) {
  const data = useSelector((state) => state.visualizations.entities[id]);

  const width = '100%';
  const height = '100%';
  const yAxisWidth = 90;

  return (
    <div data-testid="graph" className={styles.wrapper}>
      {data.graphType === 'bar' && (
        <ResponsiveContainer width={width} height={height}>
          <BarChart data={data.data}>
            <CartesianGrid strokeDasharray={'1 1'} />
            <XAxis dataKey={'fecha'} />
            <YAxis width={yAxisWidth} />
            <Legend />
            <Tooltip />
            {data.selectedSeries.map((el, i) => {
              return <Bar key={i} dataKey={el} fill={data.colors[el]} />;
            })}
          </BarChart>
        </ResponsiveContainer>
      )}

      {data.graphType === 'line' && (
        <ResponsiveContainer width={width} height={height}>
          <LineChart data={data.data}>
            <CartesianGrid strokeDasharray={'1 1'} />
            <XAxis dataKey={'fecha'} />
            <YAxis width={yAxisWidth} />
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
        </ResponsiveContainer>
      )}
      {data.graphType === 'area' && (
        <ResponsiveContainer width={width} height={height}>
          <AreaChart data={data.data}>
            <CartesianGrid strokeDasharray={'1 1'} />
            <XAxis dataKey={'fecha'} />
            <YAxis width={yAxisWidth} />
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
        </ResponsiveContainer>
      )}
    </div>
  );
}
