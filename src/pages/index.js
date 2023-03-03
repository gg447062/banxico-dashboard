import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { AddVisualizationModal } from '@/Components/Modals';
import { useModals } from '@/hooks/useModals';
import { useSelector } from 'react-redux';
import Visualization from '@/Components/Visualization';

export default function Home() {
  const [openAddModal, closeAddModal, addModalOpen] = useModals('addModal');
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
            return <Visualization input={el} key={i} />;
          })}
        </div>
        <button onClick={openAddModal}>+</button>
        <AddVisualizationModal hide={closeAddModal} isOpen={addModalOpen} />
      </main>
    </>
  );
}
