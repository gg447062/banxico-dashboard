import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { VisualizationModal } from '@/Components/Modals';
import { useModals } from '@/hooks/useModals';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import Visualization from '@/Components/Visualization';
import Button from '@/Components/Button';

export default function Home() {
  const [openAddModal, closeAddModal, addModalOpen] = useModals('addModal');
  const [openEditModal, closeEditModal, editModalOpen] = useModals('editModal');
  const [currentVisualization, setCurrentVisualization] = useState('');
  const visualizations = useSelector((state) => state.visualizations.entities);

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
      <main className={styles.main}>
        {/* <h2>welcome to the dashboard</h2> */}
        <div>
          {Object.values(visualizations).map((el, i) => {
            return (
              <Visualization
                id={el.id}
                type={el.type}
                key={i}
                setCurrentVisualization={setCurrentVisualization}
                openEditModal={openEditModal}
              />
            );
          })}
        </div>
        <Button onClick={openAddModal} text="add" type="primary" />
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
