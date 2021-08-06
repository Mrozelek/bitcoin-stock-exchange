import registerTransaction from './transactionRegister';
import databaseService from '../../services/databaseService';
import { TRANSACTIONS_HISTORY_KEY } from '../../utils/constants';

const transactionInfo = { userId: 1, currencyName: 'ETH', amount: 5, price: 1 };

describe('registerTransaction function', () => {
  beforeEach(async () => {
    await databaseService.setItem(TRANSACTIONS_HISTORY_KEY, []);
  });

  it('should save information with datastamp about successful transaction', async () => {
    await registerTransaction(transactionInfo);
    const [testObject] = await databaseService.getItem(TRANSACTIONS_HISTORY_KEY);
    expect(testObject).toStrictEqual({ transactionInfo, time: expect.any(String) });
  });

  it('should save information with datastamp and error about failed transaction', async () => {
    const error = new Error('Fail');
    await registerTransaction(transactionInfo, new Error('Fail'));
    const [testObject] = await databaseService.getItem(TRANSACTIONS_HISTORY_KEY);
    expect(testObject).toStrictEqual({ transactionInfo, time: expect.any(String), error: error.message });
  });

  it('should not delete a history of the other transactions', async () => {
    await registerTransaction(transactionInfo);
    await registerTransaction(transactionInfo);
    expect(await databaseService.getItem(TRANSACTIONS_HISTORY_KEY)).toHaveLength(2);
  });
});
