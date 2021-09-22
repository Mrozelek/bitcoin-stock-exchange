import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import stock from './stock/reducer';
import exchange from './exchange/reducer';

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  stock,
  exchange
});

export default createRootReducer;
