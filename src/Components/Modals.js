import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { fetchData } from '@/store/visualizations';
import axios from 'axios';
import styles from '@/styles/Modals.module.css';
import { v4 as uuid } from 'uuid';

export function AddVisualizationModal({ isOpen, hide }) {
  const today = new Date().toISOString().split('T')[0];
  const [series, setSeries] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState([]);
  const [type, setType] = useState('table');
  const [decimals, setDecimals] = useState(1);
  const [dateFormat, setDateFormat] = useState('dd/mm/yyyy');
  const [graphType, setGraphType] = useState('');
  const [colors, setColors] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(today);
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('es');
  const dispatch = useDispatch();

  function reset() {
    setSeries(null);
    setPage(1);
    setQuery('');
    setSelectedSeries([]);
    setType('table');
    setStartDate('');
    setEndDate(today);
    setTitle('');
    setLanguage('es');
  }

  async function add() {
    const seriesString = selectedSeries.join(',');
    const id = uuid().slice(0, 8);
    const data =
      type === 'table'
        ? {
            seriesString,
            type,
            language,
            title,
            startDate,
            endDate,
            decimals,
            dateFormat,
            id,
          }
        : {
            seriesString,
            type,
            language,
            title,
            startDate,
            endDate,
            graphType,
            colors,
            id,
          };
    dispatch(fetchData(data));
    reset();
    hide();
  }

  function handleClick(el, val) {
    if (el.classList.contains(styles.selected)) {
      el.classList.remove(styles.selected);
      const i = selectedSeries.indexOf(val);
      const _selectedSeries = selectedSeries
        .slice(0, i)
        .concat(selectedSeries.slice(i + 1));
      setSelectedSeries(_selectedSeries);
    } else {
      el.classList.add(styles.selected);
      setSelectedSeries([...selectedSeries, val]);
    }
  }

  useEffect(() => {
    async function fetchSeriesData() {
      const { data } = await axios.get(
        `https://5i8qcjp333.execute-api.us-east-1.amazonaws.com/dev/series/?page=1`,
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_TUKAN_TOKEN,
          },
        }
      );
      setSeries(data.data);
    }
    if (isOpen && !series) {
      fetchSeriesData();
    }
  }, [isOpen, series]);

  return isOpen
    ? createPortal(
        <div className={styles.base}>
          <label htmlFor="query">search</label>
          <input
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          ></input>
          <div>
            {series &&
              series.map((el, i) => {
                return (
                  <p
                    key={i}
                    onClick={(e) => {
                      handleClick(e.target, el.variable);
                    }}
                  >
                    {el.display_name}
                  </p>
                );
              })}
          </div>
          <label htmlFor="type">Visualization Type</label>
          <select id="type" onChange={(e) => setType(e.target.value)}>
            <option value={'table'}>table</option>
            <option value={'graph'}>graph</option>
          </select>
          {type === 'table' && (
            <>
              <label htmlFor="decimals">Decimals</label>
              <input
                id="decimals"
                type="number"
                value={decimals}
                onChange={(e) => setDecimals(e.target.value)}
              ></input>
              <label htmlFor="dateFormat" defaultValue={dateFormat}>
                Date Format
              </label>
              <select
                id="dateFormat"
                onChange={(e) => setDateFormat(e.target.value)}
              >
                <option value={'mm/dd/yyy'}>mm/dd/yyy</option>
                <option value={'dd/mm/yyyy'}>dd/mm/yyyy</option>
                <option value={'yyyy/dd/mm'}>yyyy/dd/mm</option>
              </select>
            </>
          )}
          {type === 'graph' && (
            <>
              <label htmlFor="graphType">Graph Type</label>
              <select
                id="graphType"
                onChange={(e) => setGraphType(e.target.value)}
                defaultValue={graphType}
              >
                <option value={'bar'}>bar</option>
                <option value={'area'}>area</option>
                <option value={'line'}>line</option>
              </select>
              <p>Select colors for each series</p>
              {selectedSeries.map((el, i) => {
                return (
                  <div key={i}>
                    <label htmlFor="color-select">{el}</label>
                    <select
                      id="color-select"
                      onChange={(e) => {
                        setColors({ ...colors, [el]: e.target.value });
                      }}
                      defaultValue="---"
                    >
                      <option>blue</option>
                      <option>red</option>
                      <option>green</option>
                      <option>pink</option>
                    </select>
                  </div>
                );
              })}
            </>
          )}
          <label htmlFor="startDate">start date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          ></input>
          <label htmlFor="endDate">end date</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          ></input>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
          <label htmlFor="language">Language</label>
          <select id="language" onChange={(e) => setLanguage(e.target.value)}>
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
          <button onClick={hide}>cancel</button>
          <button onClick={add}>add</button>
        </div>,
        document.body
      )
    : null;
}
