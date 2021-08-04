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

const Notifier = () => {
  const store = useStore();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showNotification = ({ message, options }) => {
    enqueueSnackbar(message, options);
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
      options: { variant: 'error' }
    },
    {
      currentState: currentStateExchangeSuccess,
      previousState: previousStateExchangeSuccess,
      select: selectExchangeSuccess,
      pred: predExchangeSuccess,
      getMessage: getMessageExchangeSuccess,
      options: { variant: 'success' }
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
        action: closeAction
      }
    }
  ];

  const handleNotifications = () => {
    const storeState = store.getState();

    notifiers.forEach((notifier) => {
      notifier.previousState = notifier.currentState;
      notifier.currentState = notifier.select(storeState);

      if (notifier.previousState !== notifier.currentState && notifier.pred(notifier.currentState)) {
        showNotification({ message: notifier.getMessage(notifier.currentState), options: notifier.options });
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
