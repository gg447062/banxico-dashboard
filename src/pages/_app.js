import '@/styles/globals.css';
import { Provider } from 'react-redux';
import { wrapper } from '@/store';

export default function App({ Component, pageProps }) {
  const { store } = wrapper.useWrappedStore(pageProps);

  return (
    <Provider store={store}>
      <Component {...pageProps} />;
    </Provider>
  );
}
