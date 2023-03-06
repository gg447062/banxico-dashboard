import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData, update } from '@/store/visualizations';
import axios from 'axios';
import styles from '@/styles/Modals.module.css';
import { v4 as uuid } from 'uuid';

export function VisualizationModal({ isOpen, hide, mode = 'add', id = '' }) {
  const today = new Date().toISOString().split('T')[0];
  const [series, setSeries] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState([]);
  const [type, setType] = useState('table');
  const [decimals, setDecimals] = useState(1);
  const [dateFormat, setDateFormat] = useState('');
  const [graphType, setGraphType] = useState('');
  const [colors, setColors] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(today);
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('es');
  const dispatch = useDispatch();
  const visualizationData = useSelector(
    (state) => state.visualizations.entities[id]
  );

  function reset() {
    setSeries(null);
    setPage(1);
    setQuery('');
    setSelectedSeries([]);
    setType('table');
    setGraphType('');
    setColors('');
    setDecimals('');
    setDateFormat('');
    setStartDate('');
    setEndDate(today);
    setTitle('');
    setLanguage('es');
  }

  function updateVisualization() {
    const seriesString = selectedSeries.join(',');
    const updated = true;
    dispatch(
      fetchData({
        seriesString,
        type,
        language,
        title,
        startDate,
        endDate,
        decimals,
        dateFormat,
        graphType,
        colors,
        id,
        updated,
      })
    );

    // dispatch(
    //   update({
    //     seriesString,
    //     type,
    //     language,
    //     title,
    //     startDate,
    //     endDate,
    //     decimals,
    //     dateFormat,
    //     graphType,
    //     colors,
    //     id,
    //   })
    // );
    reset();
    hide();
  }

  async function add() {
    const seriesString = selectedSeries.join(',');
    const id = uuid().slice(0, 8);
    const updated = false;
    dispatch(
      fetchData({
        seriesString,
        type,
        language,
        title,
        startDate,
        endDate,
        decimals,
        dateFormat,
        graphType,
        colors,
        id,
        updated,
      })
    );
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

    function setStateFromVisualization() {
      setSelectedSeries(visualizationData.selectedSeries);
      setType(visualizationData.type);
      setStartDate(visualizationData.startDate);
      setEndDate(visualizationData.endDate);
      setTitle(visualizationData.title);
      setLanguage(visualizationData.language);
      setGraphType(visualizationData.graphType);
      setColors(visualizationData.colors);
      setDecimals(visualizationData.decimals);
      setDateFormat(visualizationData.dateFormat);
    }

    if (isOpen && !series) {
      fetchSeriesData();
      if (mode === 'edit') {
        setStateFromVisualization();
      }
    }
  }, [isOpen, series, mode, visualizationData]);

  return isOpen
    ? createPortal(
        <div className={styles.base}>
          <div>selected series</div>
          <div>
            {selectedSeries.map((el, i) => {
              return <div key={i}>{el}</div>;
            })}
          </div>
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
                    className={
                      selectedSeries.includes(el.variable)
                        ? styles.selected
                        : ''
                    }
                  >
                    {el.display_name}
                  </p>
                );
              })}
          </div>
          <label htmlFor="type">Visualization Type</label>
          <select
            id="type"
            onChange={(e) => setType(e.target.value)}
            value={type}
          >
            <option value={''}>-----</option>
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
              <label htmlFor="dateFormat">Date Format</label>
              <select
                id="dateFormat"
                onChange={(e) => setDateFormat(e.target.value)}
                defaultValue={dateFormat}
              >
                <option value={''}>-----</option>
                <option value={'dd/mm/yyyy'}>dd/mm/yyyy</option>
                <option value={'mm/dd/yyyy'}>mm/dd/yyyy</option>
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
                <option value={''}>-----</option>
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
                      defaultValue={colors[el]}
                    >
                      <option>----</option>
                      <option value={'blue'}>blue</option>
                      <option value={'red'}>red</option>
                      <option value={'green'}>green</option>
                      <option value={'pink'}>pink</option>
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
          <select
            id="language"
            onChange={(e) => setLanguage(e.target.value)}
            defaultValue={language}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
          <button onClick={hide}>cancel</button>
          {mode === 'add' && <button onClick={add}>add</button>}
          {mode === 'edit' && (
            <button onClick={updateVisualization}>update</button>
          )}
        </div>,
        document.body
      )
    : null;
}
