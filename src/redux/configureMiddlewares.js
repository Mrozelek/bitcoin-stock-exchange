import registerTransaction from './middlewares/transactionRegister';
import { EXCHANGE_MAKE_SUCCESS, EXCHANGE_MAKE_FAILURE } from './reducers/exchange/actions';

const exchangeMiddleware = () => (next) => (action) => {
  switch (action.type) {
    case EXCHANGE_MAKE_SUCCESS:
      registerTransaction(action.payload.transactionInfo);
      break;
    case EXCHANGE_MAKE_FAILURE:
      registerTransaction(action.payload.transactionInfo, action.payload.error);
      break;
    default:
      break;
  }

  next(action);
};

export default [exchangeMiddleware];
