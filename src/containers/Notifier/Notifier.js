import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useStore } from 'react-redux';

let exchangeErrorCurrent;
const selectExchangeError = (storeState) => storeState.exchange;
const predExchangeError = (currentState) => currentState.isError;
const messageExchangeError = (currentState) => currentState.error;
const handleExchangeErrorMessage = (storeState) => {
  const previousState = exchangeErrorCurrent;
  exchangeErrorCurrent = selectExchangeError(storeState);

  if (previousState !== exchangeErrorCurrent && predExchangeError(exchangeErrorCurrent)) {
    return [true, messageExchangeError(exchangeErrorCurrent)];
  }
  return [false];
};

let exchangeSuccessCurrent;
const selectExchangeSuccess = (storeState) => storeState.exchange;
const predExchangeSuccess = (currentState) => !currentState.isLoading && !currentState.isError;
const messageExchangeSuccess = () => 'Exchange successful';
const handleExchangeSuccessMessage = (storeState) => {
  const previousState = exchangeSuccessCurrent;
  exchangeSuccessCurrent = selectExchangeSuccess(storeState);

  if (previousState !== exchangeSuccessCurrent && predExchangeSuccess(exchangeSuccessCurrent)) {
    return [true, messageExchangeSuccess(exchangeSuccessCurrent)];
  }
  return [false];
};

let stockFetchErrorCurrent;
const selectStockFetchError = (storeState) => storeState.stock;
const predStockFetchError = (currentState) => currentState.isError;
const messageStockFetchError = (currentState) => currentState.error;
const handleStockFetchErrorMessage = (storeState) => {
  const previousState = stockFetchErrorCurrent;
  stockFetchErrorCurrent = selectStockFetchError(storeState);

  if (previousState !== stockFetchErrorCurrent && predStockFetchError(stockFetchErrorCurrent)) {
    return [true, messageStockFetchError(stockFetchErrorCurrent)];
  }
  return [false];
};

const Notifier = () => {
  const store = useStore();
  const { enqueueSnackbar } = useSnackbar();

  const notifierHandlers = [
    handleExchangeErrorMessage,
    handleExchangeSuccessMessage,
    handleStockFetchErrorMessage
  ];

  const handleNotifier = () => {
    const state = store.getState();

    notifierHandlers.forEach((handler) => {
      const [shouldEnqueueSnackbar, message] = handler(state);

      if (shouldEnqueueSnackbar) {
        enqueueSnackbar(message);
      }
    });
  };

  useEffect(() => {
    const unsubscribe = store.subscribe(handleNotifier);
    return () => {
      unsubscribe();
    };
  }, []);

  return null;
};

export default Notifier;
