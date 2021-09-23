import { DateTime } from 'luxon';
import { EXCHANGE_MAKE_INIT, EXCHANGE_MAKE_SUCCESS, EXCHANGE_MAKE_FAILURE, FETCH_TRANSACTIONS } from './actions';

export const initialState = {
  isLoading: true,
  isError: false,
  error: null,
  transactionRecords: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case EXCHANGE_MAKE_INIT: {
      return {
        ...initialState,
        transactionRecords: state.transactionRecords
      };
    }
    case EXCHANGE_MAKE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        transactionRecords: [
          ...state.transactionRecords,
          {
            time: DateTime.now().toISO(),
            transactionInfo: action.payload.transactionInfo
          }
        ]
      };
    }
    case EXCHANGE_MAKE_FAILURE: {
      return {
        ...state,
        isLoading: false,
        isError: true,
        error: action.payload.error,
        transactionRecords: [
          ...state.transactionRecords,
          {
            time: DateTime.now().toISO(),
            transactionInfo: action.payload.transactionInfo,
            error: action.payload.error
          }
        ]
      };
    }
    case FETCH_TRANSACTIONS: {
      return {
        ...state,
        transactionRecords: action.payload.transactionRecords
      };
    }
    default:
      return state;
  }
};
