import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { fetchData } from '@/store/visualizations';
import axios from 'axios';
import styles from '@/styles/Modals.module.css';

export function AddVisualizationModal({ isOpen, hide }) {
  const [series, setSeries] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState([]);
  const [type, setType] = useState('table');
  //   const [startDate, setStartDate] = useState('');
  //   const [endDate, setEndDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('es');
  const dispatch = useDispatch();

  async function add() {
    const seriesString = selectedSeries.join(',');
    dispatch(fetchData({ seriesString, type, language, title }));
    hide();
  }

  useEffect(() => {
    async function fetchData() {
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
      fetchData();
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
          <ul>
            {series &&
              series.map((el, i) => {
                return (
                  <li
                    className={styles.li}
                    key={i}
                    onClick={(e) => {
                      e.target.classList.add(styles.selected);
                      setSelectedSeries([...selectedSeries, el.variable]);
                    }}
                  >
                    {el.display_name}
                  </li>
                );
              })}
          </ul>

          <label htmlFor="type">Visualization Type</label>
          <select id="type" onChange={(e) => setType(e.target.value)}>
            <option value={'table'}>table</option>
            <option value={'graph'}>graph</option>
          </select>
          {/* <label htmlFor="startDate">start date</label>
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
          ></input> */}
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
