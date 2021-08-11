import React from 'react';
import axios from 'axios';
import configureMockStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import thunk from 'redux-thunk';
import { SnackbarProvider } from 'notistack';
import { SnackbarUtilsConfigurator } from '../../../utils/SnackbarUtils';
import * as actions from './actions';
import reducer, { initialState } from './reducer';

jest.mock('axios');

describe('Action creators', () => {
  it('should create an action to initialize a get stock data request', () => {
    const expectedAction = { type: actions.STOCK_GET_INIT };
    expect(actions.getStockInit()).toEqual(expectedAction);
  });

  it('should create an action to fail a get stock data request', () => {
    const error = 'Wrong argument';
    const expectedAction = {
      type: actions.STOCK_GET_FAILURE,
      payload: { error }
    };
    expect(actions.getStockFail(error)).toEqual(expectedAction);
  });

  it('should create an action to success a get stock data request', () => {
    const stockData = [];
    const expectedAction = {
      type: actions.STOCK_GET_SUCCESS,
      payload: { stockData }
    };
    expect(actions.getStockSuccess(stockData)).toEqual(expectedAction);
  });
});

const sampleResponse = [{
  symbol: 'btc',
  image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
  current_price: 34883,
  market_cap: 653759402456,
  price_change_percentage_24h: 3.91425,
  market_cap_change_24h: 26894035129
}];

describe('Async action creator', () => {
  const mockStore = configureMockStore([thunk]);

  const expectedSuccessActions = [
    { type: actions.STOCK_GET_INIT },
    { payload: { stockData: sampleResponse }, type: actions.STOCK_GET_SUCCESS }
  ];

  const expectedFailureActions = [
    { type: actions.STOCK_GET_INIT },
    { payload: { error: 'Failed to fetch data' }, type: actions.STOCK_GET_FAILURE }
  ];

  let store;

  beforeEach(() => {
    render(<SnackbarProvider><SnackbarUtilsConfigurator /></SnackbarProvider>);
    store = mockStore({});
  });

  it('creates STOCK_GET_SUCCESS when fetching stock data has been done', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: sampleResponse }));

    await store.dispatch(actions.getTickers());
    expect(store.getActions()).toEqual(expectedSuccessActions);
  });

  it('creates STOCK_GET_FAILURE when fetching stock data failed', async () => {
    axios.get.mockImplementationOnce(() => Promise.reject(new Error('Failed to fetch data')));

    await store.dispatch(actions.getTickers());
    expect(store.getActions()).toEqual(expectedFailureActions);
  });
});

describe('Stock reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle STOCK_GET_INIT', () => {
    [initialState, {
      isLoading: false,
      isError: false,
      error: null,
      stockData: []
    }].forEach((state) => {
      expect(
        reducer(state, actions.getStockInit())
      ).toEqual({
        ...initialState,
        isLoading: true,
        isError: false
      });
    });
  });

  it('should handle STOCK_GET_SUCCESS', () => {
    const { stockData, isLoading, isError, error } = reducer(
      initialState,
      actions.getStockSuccess(sampleResponse)
    );

    const [{ name, change, price, cap, imageUrl }] = stockData;

    expect({ isLoading, isError, error })
      .toEqual({ isLoading: false, isError: false, error: null });

    expect({ name, change, price, cap, imageUrl })
      .toEqual({
        name: sampleResponse[0].symbol.toUpperCase(),
        change: sampleResponse[0].price_change_percentage_24h,
        price: sampleResponse[0].current_price,
        cap: sampleResponse[0].market_cap,
        imageUrl: sampleResponse[0].image
      });
  });

  it('should handle STOCK_GET_FAILURE', () => {
    expect(
      reducer(initialState, actions.getStockFail('Failed to fetch'))
    ).toEqual({
      ...initialState,
      isLoading: false,
      isError: true,
      error: 'Failed to fetch'
    });
  });
});
