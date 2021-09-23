import React from 'react';
import { Provider } from 'react-redux';
import { Router, useLocation } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, screen, fireEvent, act } from '@testing-library/react';
import capitalize from 'capitalize';
import configureStore from '../../redux/configureStore';
import { StockBuilder } from '../../utils/stockBuilder';
import Transaction, { fields, errorMessages } from './Transaction';
import databaseService from '../../services/databaseService';
import { USERS_PROFILES_KEY } from '../../utils/constants';
import { exchangeRoute } from '../../utils/routes';

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

const stockExchangeData = sampleData.map((data) => new StockBuilder()
  .setName(data.name)
  .setChange(data.change)
  .setPrice(data.price)
  .build());

const history = createMemoryHistory();
const store = configureStore();

const amountFieldLabelName = capitalize(fields.amount);
const priceFieldLabelName = capitalize(fields.price);
const totalFieldLabelName = capitalize(fields.total);

const LocationDisplay = () => {
  const location = useLocation();

  return <div data-testid="location-display">{location.pathname}</div>;
};

describe('Transaction', () => {
  beforeAll(async () => {
    await databaseService.setItem(USERS_PROFILES_KEY, [{
      userId: 1,
      funds: {
        ETH: 5,
        USD: 10
      },
      transactions: []
    }]);
  });

  beforeEach(async () => {
    await act(async () => {
      render(
        <Router history={history}>
          <Provider store={store}>
            <Transaction stockExchangeData={stockExchangeData} />
            <LocationDisplay />
          </Provider>
        </Router>
      );
    });
  });

  it('should display required and type error when values are empty', async () => {
    await act(async () => {
      fireEvent.input(screen.getByLabelText(amountFieldLabelName), { target: { value: '' } });
      fireEvent.submit(screen.getByRole('button', { name: 'Confirm' }));
    });

    expect(screen.getByText(errorMessages.required)).toBeInTheDocument();
    expect(screen.getByText(errorMessages.typeError)).toBeInTheDocument();
  });

  it('should display positive number error when amount field is negative or neutral', async () => {
    const testValues = [0, -5];

    for await (const value of testValues) {
      await act(async () => {
        fireEvent.input(screen.getByLabelText(amountFieldLabelName), { target: { value } });
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
      fireEvent.input(screen.getByLabelText(amountFieldLabelName), { target: { value: 15.3 } });
      fireEvent.input(screen.getByTestId(fields.currency), { target: { value: 'ETH' } });
    });
    expect(screen.getByLabelText(amountFieldLabelName).value).toBe('15.3');
    expect(screen.getByTestId(fields.currency).value).toBe('ETH');

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    });
    expect(screen.getByLabelText(amountFieldLabelName).value).toBe('0');
    expect(screen.getByTestId(fields.currency).value).toBe('');
  });

  describe('when choose currency type', () => {
    beforeEach(async () => {
      await act(async () => {
        fireEvent.input(screen.getByTestId(fields.currency), { target: { value: 'BTC' } });
      });
    });

    it('should display its price', () => {
      expect(screen.getByLabelText(priceFieldLabelName).value).toBe('184406.9800');
    });

    describe('and when change amount value', () => {
      beforeEach(async () => {
        await act(async () => {
          fireEvent.input(screen.getByLabelText(amountFieldLabelName), { target: { value: 15.3 } });
        });
      });

      it('should update total value', () => {
        expect(screen.getByLabelText('Total').value).toBe('2821426.7940');
      });

      describe('and when change currenty type again', () => {
        beforeEach(async () => {
          await act(async () => {
            fireEvent.input(screen.getByTestId(fields.currency), { target: { value: 'ETH' } });
          });
        });

        it('should update price and total values', async () => {
          expect(screen.getByLabelText(priceFieldLabelName).value).toBe('6138.0700');
          expect(screen.getByLabelText(totalFieldLabelName).value).toBe('93912.4710');
        });
      });
    });
  });

  it('should not change correct route', () => {
    history.push(exchangeRoute);
    expect(screen.getByTestId('location-display')).toHaveTextContent(exchangeRoute);

    history.push(`${exchangeRoute}/ETH`);
    expect(screen.getByTestId('location-display')).toHaveTextContent(`${exchangeRoute}/ETH`);
  });

  it('should change incorrect route', () => {
    history.push(`${exchangeRoute}/GRGRS`);
    expect(screen.getByTestId('location-display')).toHaveTextContent(`${exchangeRoute}/`);
  });

  it('should change route when currency changes', () => {
    history.push(exchangeRoute);

    act(() => {
      fireEvent.input(screen.getByTestId(fields.currency), { target: { value: 'BTC' } });
    });

    expect(screen.getByTestId('location-display')).toHaveTextContent(`${exchangeRoute}/BTC`);
  });

  it('should change route when reset button is clicked', () => {
    history.push(`${exchangeRoute}/BTC`);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    });

    expect(screen.getByTestId('location-display')).toHaveTextContent(exchangeRoute);
  });
});
