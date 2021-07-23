import registerTransaction from './middlewares/transactionRegister';
import { EXCHANGE_MAKE_SUCCESS, EXCHANGE_MAKE_FAILURE } from './reducers/exchange/actions';

const exchangeMiddleware = () => (next) => (action) => {
  if (action.type === EXCHANGE_MAKE_SUCCESS || action.type === EXCHANGE_MAKE_FAILURE) {
    registerTransaction(action.payload.transactionInfo);
  }

  next(action);
};

export default [exchangeMiddleware];
