import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, screen, fireEvent, act } from '@testing-library/react';
import configureStore from '../../redux/configureStore';
import { StockBuilder } from '../../utils/stockBuilder';
import Transaction, { errorMessages } from './Transaction';
import { DEFAULT_CRYPTO } from '../../utils/constants';

const sampleData = [
  {
    name: 'BTC',
    price: 184406.98,
    change: 0.049,
    cap: 3444312.55
  },
  {
    name: 'ETH',
    price: 6138.07,
    change: 0.059,
    cap: 704883.33
  },
  {
    name: 'BNB',
    price: 938.31,
    change: -0.031,
    cap: 144583.29
  },
  {
    name: 'USDT',
    price: 3.27,
    change: -0.003,
    cap: 129465.66
  },
  {
    name: 'AAA',
    price: 184406.98,
    change: 0.049,
    cap: 3444312.55
  },
  {
    name: 'BBB',
    price: 184406.98,
    change: 0.049,
    cap: 3444312.55
  },
  {
    name: 'CCC',
    price: 184406.98,
    change: 0.049,
    cap: 3444312.55
  },
  {
    name: 'DDD',
    price: 184406.98,
    change: 0.049,
    cap: 3444312.55
  },
  {
    name: 'EEE',
    price: 184406.98,
    change: 0.049,
    cap: 3444312.55
  }
];

const history = createMemoryHistory();

describe('Transaction', () => {
  const stockExchangeData = sampleData.map((data) => new StockBuilder()
    .setName(data.name)
    .setChange(data.change)
    .setPrice(data.price)
    .build());

  beforeEach(async () => {
    await act(async () => {
      const store = configureStore();
      render(
        <Router history={history}>
          <Provider store={store}>
            <Transaction stockExchangeData={stockExchangeData} />
          </Provider>
        </Router>
      );
    });
  });

  it('should display required error when values are empty', async () => {
    await act(async () => {
      fireEvent.input(screen.getByLabelText('Amount'), { target: { value: '' } });
      fireEvent.submit(screen.getByRole('button', { name: 'Confirm' }));
    });

    expect(screen.getAllByText(errorMessages.required)).toHaveLength(1);
  });

  it('should display positive number error when amount field is negative or neutral', async () => {
    const testValues = [0, -5];

    for await (const value of testValues) {
      await act(async () => {
        fireEvent.input(screen.getByLabelText('Amount'), { target: { value } });
        fireEvent.submit(screen.getByRole('button', { name: 'Confirm' }));
      });
      expect(screen.getByText(errorMessages.min)).toBeInTheDocument();
    }
  });

  it('should change transaction type when switch for transaction type is clicked', async () => {
    const prevValue = screen.getByRole('checkbox').value;
    await act(async () => {
      fireEvent.click(screen.getByRole('checkbox'));
    });
    expect(screen.getByRole('checkbox').value).not.toBe(prevValue);
  });

  it('should reset form when reset button is clicked', async () => {
    await act(async () => {
      fireEvent.input(screen.getByLabelText('Amount'), { target: { value: 15.3 } });
      fireEvent.input(screen.getByTestId('currencyName'), { target: { value: 'ETH' } });
    });
    expect(screen.getByLabelText('Amount').value).toBe('15.3');
    expect(screen.getByTestId('currencyName').value).toBe('ETH');

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    });
    expect(screen.getByLabelText('Amount').value).toBe('0');
    expect(screen.getByTestId('currencyName').value).toBe(DEFAULT_CRYPTO);
  });

  describe('when choose currency type', () => {
    beforeEach(async () => {
      await act(async () => {
        fireEvent.input(screen.getByTestId('currencyName'), { target: { value: 'BTC' } });
      });
    });

    it('should display its price', () => {
      expect(screen.getByLabelText('Price').value).toBe('184406.98');
    });

    describe('and when change amount value', () => {
      beforeEach(async () => {
        await act(async () => {
          fireEvent.input(screen.getByLabelText('Amount'), { target: { value: 15.3 } });
        });
      });

      it('should update total value', () => {
        expect(screen.getByLabelText('Total').value).toBe('2821426.794');
      });

      describe('and when change currenty type again', () => {
        beforeEach(async () => {
          await act(async () => {
            fireEvent.input(screen.getByTestId('currencyName'), { target: { value: 'ETH' } });
          });
        });

        it('should update price and total values', async () => {
          expect(screen.getByLabelText('Price').value).toBe('6138.07');
          expect(screen.getByLabelText('Total').value).toBe('93912.471');
        });
      });
    });
  });
});
