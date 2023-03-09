import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSeriesData } from '@/store/visualizations';
import axios from 'axios';
import styles from '@/styles/Modals.module.css';
import { v4 as uuid } from 'uuid';
import Button from './Button';

export function VisualizationModal({ isOpen, hide, mode = 'add', id = '' }) {
  const today = new Date().toISOString().split('T')[0];
  const [series, setSeries] = useState(null);
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(null);
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
    // setSeries(null);
    // setPage(1);
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

  function cancel() {
    reset();
    hide();
  }

  async function addOrUpdate() {
    const seriesString = selectedSeries.join(',');
    const newId = uuid().slice(0, 8);

    dispatch(
      fetchSeriesData({
        seriesString,
        type,
        language,
        title,
        startDate,
        endDate,
        decimals: type === 'table' ? decimals : '',
        dateFormat: type === 'table' ? dateFormat : '',
        graphType: type === 'graph' ? graphType : '',
        colors: type === 'graph' ? colors : '',
        id: id ? id : newId,
      })
    );
    reset();
    hide();
  }

  function handleClick(el, val) {
    if (selectedSeries.includes(val)) {
      el.classList.remove(styles.selected);

      const _selectedSeries = selectedSeries.filter((el) => el !== val);
      const { [val]: tmp, ...rest } = colors;
      setColors(rest);
      setSelectedSeries(_selectedSeries);
    } else {
      el.classList.add(styles.selected);

      setSelectedSeries([...selectedSeries, val]);
    }
  }

  async function handleNextPage(increment) {
    const nextPage = page + increment;
    if (nextPage < 1 || nextPage > pageLimit) {
      return;
    } else {
      const { data } = await axios.get(
        `https://5i8qcjp333.execute-api.us-east-1.amazonaws.com/dev/series/?page=${nextPage}`,
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_TUKAN_TOKEN,
          },
        }
      );
      setSeries(data.data);
      setPage(nextPage);
    }
  }

  useEffect(() => {
    async function fetchSeriesCatalog() {
      const { data } = await axios.get(
        `https://5i8qcjp333.execute-api.us-east-1.amazonaws.com/dev/series/?page=1`,
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_TUKAN_TOKEN,
          },
        }
      );

      setSeries(data.data);
      setPageLimit(data.totalPages);
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
      fetchSeriesCatalog();
    }
    if (isOpen && mode === 'edit') {
      setStateFromVisualization();
    }
  }, [isOpen, series, mode, visualizationData]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }, [isOpen]);

  return isOpen
    ? createPortal(
        <div className={styles.bg}>
          <div className={styles.body}>
            <div className={styles.row}>
              <h2 className={styles.h2}>Add a visualization</h2>
            </div>
            <div className={styles.row}>
              <div className={styles.column}>
                <div className={styles.seriesList}>
                  <div className={styles.searchBar}>
                    <input
                      id="query"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search"
                    ></input>

                    <div className={styles.searchBarRow}>
                      <Button
                        onClick={() => {
                          handleNextPage(-1);
                        }}
                        type="primary"
                        text={
                          <span class="material-symbols-outlined">
                            arrow_back_ios
                          </span>
                        }
                        label="previous"
                      />
                      <span>{page}</span>
                      <Button
                        onClick={() => {
                          handleNextPage(1);
                        }}
                        type="primary"
                        text={
                          <span class="material-symbols-outlined">
                            arrow_forward_ios
                          </span>
                        }
                        label="next"
                      />
                    </div>
                  </div>
                  <div className={styles.tableWrap}>
                    <table>
                      <thead className={styles.thead}>
                        <tr>
                          <th className={styles.th}>ID</th>
                          <th className={styles.th}>Name</th>
                          <th className={styles.th}>Add</th>
                        </tr>
                      </thead>
                      <tbody className={styles.tbody}>
                        {series &&
                          series.map((el, i) => {
                            return (
                              <tr key={i} className={styles.tr}>
                                <td className={styles.tdBold}>{el.variable}</td>
                                <td className={styles.td}>{el.display_name}</td>
                                <td
                                  aria-label="series-catalog-item"
                                  onClick={(e) => {
                                    handleClick(e.target, el.variable);
                                  }}
                                  className={
                                    selectedSeries.includes(el.variable)
                                      ? styles.tdSelected
                                      : styles.td
                                  }
                                >
                                  <span className="material-symbols-outlined">
                                    {selectedSeries.includes(el.variable)
                                      ? 'remove'
                                      : 'add'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className={styles.inputs}>
                <div className={styles.column}>
                  <div className={styles.column}>
                    <h3>Selected Series:</h3>
                    <div className={styles.seriesRow}>
                      {selectedSeries.map((el, i) => {
                        return (
                          <div data-testid="selected-series-item" key={i}>
                            {el}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className={styles.inputRow}>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="startDate">Start Date</label>
                      <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      ></input>
                    </div>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="endDate">End Date</label>
                      <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      ></input>
                    </div>
                  </div>

                  <div className={styles.inputRow}>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="title">Title</label>
                      <input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      ></input>
                    </div>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="language">Language</label>
                      <select
                        id="language"
                        onChange={(e) => setLanguage(e.target.value)}
                        value={language}
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.inputWrapper}>
                    <label htmlFor="type">Visualization Type</label>
                    <select
                      id="type"
                      onChange={(e) => setType(e.target.value)}
                      value={type}
                    >
                      <option value={''}>-----</option>
                      <option value={'table'}>Table</option>
                      <option value={'graph'}>Graph</option>
                    </select>
                  </div>
                  <div className={styles.inputRow}>
                    {type === 'table' && (
                      <>
                        <div className={styles.inputWrapper}>
                          <label htmlFor="decimals">Decimals</label>
                          <input
                            className={styles.decimals}
                            id="decimals"
                            type="number"
                            value={decimals}
                            min={0}
                            onChange={(e) => setDecimals(e.target.value)}
                          ></input>
                        </div>
                        <div className={styles.inputWrapper}>
                          <label htmlFor="dateFormat">Date Format</label>
                          <select
                            id="dateFormat"
                            onChange={(e) => setDateFormat(e.target.value)}
                            value={dateFormat}
                          >
                            <option value={''}>-----</option>
                            <option value={'dd/mm/yyyy'}>dd/mm/yyyy</option>
                            <option value={'mm/dd/yyyy'}>mm/dd/yyyy</option>
                            <option value={'yyyy/dd/mm'}>yyyy/dd/mm</option>
                          </select>
                        </div>
                      </>
                    )}
                    {type === 'graph' && (
                      <>
                        <div className={styles.inputWrapper}>
                          <label htmlFor="graphType">Graph Type</label>
                          <select
                            id="graphType"
                            onChange={(e) => setGraphType(e.target.value)}
                            value={graphType}
                          >
                            <option value={''}>-----</option>
                            <option value={'bar'}>bar</option>
                            <option value={'area'}>area</option>
                            <option value={'line'}>line</option>
                          </select>
                        </div>
                        <div className={styles.column}>
                          <p>Series colors</p>
                          <div className={styles.colors}>
                            {selectedSeries.map((el, i) => {
                              return (
                                <div key={i} className={styles.inputWrapper}>
                                  <label htmlFor="color-select">{el}</label>
                                  <select
                                    id="color-select"
                                    onChange={(e) => {
                                      setColors({
                                        ...colors,
                                        [el]: e.target.value,
                                      });
                                    }}
                                    value={colors[el]}
                                  >
                                    <option value="">----</option>
                                    <option value={'blue'}>blue</option>
                                    <option value={'red'}>red</option>
                                    <option value={'green'}>green</option>
                                    <option value={'pink'}>pink</option>
                                  </select>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className={styles.buttons}>
                  <Button onClick={cancel} text={'Cancel'} type="cancel" />
                  {mode === 'add' && (
                    <Button
                      onClick={() => addOrUpdate()}
                      text={'Generate'}
                      type="submit"
                    />
                  )}
                  {mode === 'edit' && (
                    <Button
                      onClick={() => addOrUpdate()}
                      text={'Update'}
                      type="submit"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;
}
