import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { VisualizationModal } from '@/Components/Modals';
import { useModals } from '@/hooks/useModals';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  checkSessionStorage,
  setSessionStorage,
} from '../lib/utils/storage_utils';
import Visualization from '@/Components/Visualization';
import Button from '@/Components/Button';
import { set } from '@/store/visualizations';

export default function Home() {
  const [openAddModal, closeAddModal, addModalOpen] = useModals('addModal');
  const [openEditModal, closeEditModal, editModalOpen] = useModals('editModal');
  const [currentVisualization, setCurrentVisualization] = useState('');
  const dispatch = useDispatch();
  const visualizations = useSelector((state) => state.visualizations.entities);

  useEffect(() => {
    const sessionStorageData = checkSessionStorage();
    if (sessionStorageData && Object.keys(sessionStorageData).length > 0) {
      dispatch(set(sessionStorageData));
    }
  }, [dispatch]);

  useEffect(() => {
    setSessionStorage(visualizations);
  }, [visualizations]);

  return (
    <>
      <Head>
        <title>Banxico Dashboard</title>
        <meta
          name="description"
          content="A dashboard for visualizing Banxico data"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <h2>Banxico dashboard</h2>
        <div className={styles.buttons}>
          <Button onClick={openAddModal} text="add" type="primary" />
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.visualizations}>
          {Object.values(visualizations).length === 0 && (
            <div className={styles.welcome}>
              <h2>Welcome to the dashboard.</h2>
              <p>{`So far you don't have any visualizations`}</p>
              <p>Click the add button to begin.</p>
            </div>
          )}
          {Object.values(visualizations).length > 0 &&
            Object.values(visualizations).map((el, i) => {
              return (
                <Visualization
                  id={el.id}
                  title={el.title}
                  type={el.type}
                  key={i}
                  setCurrentVisualization={setCurrentVisualization}
                  openEditModal={openEditModal}
                />
              );
            })}
        </div>

        <VisualizationModal
          hide={closeAddModal}
          isOpen={addModalOpen}
          mode="add"
        />
        <VisualizationModal
          hide={closeEditModal}
          isOpen={editModalOpen}
          mode="edit"
          id={currentVisualization}
        />
      </main>
    </>
  );
}
