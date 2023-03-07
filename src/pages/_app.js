import '@/styles/globals.css';
import { Provider } from 'react-redux';
import { wrapper } from '@/store/index';

export default function App({ Component, ...rest }) {
  const { store, props } = wrapper.useWrappedStore(rest);

  return (
    <Provider store={store}>
      <Component {...props.pageProps} />
    </Provider>
  );
}
