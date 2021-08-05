import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useStore } from 'react-redux';
import Button from '@material-ui/core/Button';

let currentStateExchangeError;
let previousStateExchangeError;
const selectExchangeError = (storeState) => storeState.exchange;
const predExchangeError = (currentState) => currentState.isError;
const getMessageExchangeError = (currentState) => currentState.error;

let currentStateExchangeSuccess;
let previousStateExchangeSuccess;
const selectExchangeSuccess = (storeState) => storeState.exchange;
const predExchangeSuccess = (currentState) => !currentState.isLoading && !currentState.isError;
const getMessageExchangeSuccess = () => 'Exchange successful';

let currentStateStockFetchError;
let previousStateStockFetchError;
const selectStockFetchError = (storeState) => storeState.stock;
const predStockFetchError = (currentState) => currentState.isError;
const getMessageStockFetchError = (currentState) => currentState.error;

let currentStateStockFetchSuccess;
let previousStateStockFetchSuccess;
const selectStockFetchSuccess = (storeState) => storeState.stock;
const predStockFetchSuccess = (currentState) => !currentState.isLoading && !currentState.isError;

const NO_CONNECTION_SNACKBAR_KEY = 'noConnection';
const HIDE_SNACKBAR = 'hideSnackbar';
const SHOW_SNACKBAR = 'showSnackbar';

const Notifier = () => {
  const store = useStore();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showNotification = ({ message, options }) => {
    enqueueSnackbar(message, options);
  };

  const hideNotification = (key) => {
    closeSnackbar(key);
  };

  const closeAction = (key) => (
    <Button style={{ color: 'white' }} onClick={() => { closeSnackbar(key); }}>
      Dismiss
    </Button>
  );

  const notifiers = [
    {
      currentState: currentStateExchangeError,
      previousState: previousStateExchangeError,
      select: selectExchangeError,
      pred: predExchangeError,
      getMessage: getMessageExchangeError,
      options: { variant: 'error' },
      action: SHOW_SNACKBAR
    },
    {
      currentState: currentStateExchangeSuccess,
      previousState: previousStateExchangeSuccess,
      select: selectExchangeSuccess,
      pred: predExchangeSuccess,
      getMessage: getMessageExchangeSuccess,
      options: { variant: 'success' },
      action: SHOW_SNACKBAR
    },
    {
      currentState: currentStateStockFetchError,
      previousState: previousStateStockFetchError,
      select: selectStockFetchError,
      pred: predStockFetchError,
      getMessage: getMessageStockFetchError,
      options: {
        variant: 'error',
        preventDuplicate: true,
        persist: true,
        action: closeAction,
        key: NO_CONNECTION_SNACKBAR_KEY
      },
      action: SHOW_SNACKBAR
    },
    {
      currentState: currentStateStockFetchSuccess,
      previousState: previousStateStockFetchSuccess,
      select: selectStockFetchSuccess,
      pred: predStockFetchSuccess,
      key: NO_CONNECTION_SNACKBAR_KEY,
      action: HIDE_SNACKBAR
    }
  ];

  const handleNotifications = () => {
    const storeState = store.getState();

    notifiers.forEach((notifier) => {
      const { select, pred, getMessage, options, key, action } = notifier;
      notifier.previousState = notifier.currentState;
      notifier.currentState = select(storeState);

      if (notifier.previousState !== notifier.currentState && pred(notifier.currentState)) {
        switch (action) {
          case SHOW_SNACKBAR:
            showNotification({ message: getMessage(notifier.currentState), options });
            break;
          case HIDE_SNACKBAR:
            hideNotification(key);
            break;
          default:
            break;
        }
      }
    });
  };

  useEffect(() => {
    const unsubscribe = store.subscribe(handleNotifications);
    return () => {
      unsubscribe();
    };
  }, []);

  return null;
};

export default Notifier;
