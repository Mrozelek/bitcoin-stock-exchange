import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { SnackbarProvider } from 'notistack';
import configureStore, { history } from './redux/configureStore';
import { MAX_NOTIFICATIONS } from './utils/constants';
import App from './App';
import './index.scss';

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <SnackbarProvider maxSnack={MAX_NOTIFICATIONS}>
          <App />
        </SnackbarProvider>
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
