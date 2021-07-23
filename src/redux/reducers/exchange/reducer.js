import { EXCHANGE_MAKE_INIT, EXCHANGE_MAKE_SUCCESS, EXCHANGE_MAKE_FAILURE } from './actions';

export const initialState = {
  isLoading: true,
  isError: false,
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case EXCHANGE_MAKE_INIT: {
      return {
        ...state,
        isLoading: true,
        isError: false,
        error: initialState.error
      };
    }
    case EXCHANGE_MAKE_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case EXCHANGE_MAKE_FAILURE: {
      return {
        ...state,
        isLoading: false,
        isError: true,
        error: action.payload.error
      };
    }
    default:
      return state;
  }
};
