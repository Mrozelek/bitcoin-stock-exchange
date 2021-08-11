import registerTransaction from './transactionRegister';
import databaseService, { getUserById } from '../../services/databaseService';
import { USERS_PROFILES_KEY } from '../../utils/constants';

const transactionInfo = { userId: 1, currencyName: 'ETH', amount: 5, price: 1 };
const userProfile = {
  userId: 1,
  transactions: []
};

describe('registerTransaction function', () => {
  beforeEach(async () => {
    await databaseService.setItem(USERS_PROFILES_KEY, [userProfile]);
  });

  it('should save information with datastamp about successful transaction', async () => {
    await registerTransaction(transactionInfo);
    const userTransactions = (await getUserById(transactionInfo.userId)).transactions;
    expect(userTransactions).toStrictEqual([{ transactionInfo, time: expect.any(String) }]);
  });

  it('should save information with datastamp and error about failed transaction', async () => {
    const error = new Error('Fail');
    await registerTransaction(transactionInfo, error);
    const userTransactions = (await getUserById(transactionInfo.userId)).transactions;
    expect(userTransactions).toStrictEqual([{ transactionInfo, time: expect.any(String), error: error.message }]);
  });

  it('should not delete a history of the other transactions', async () => {
    await registerTransaction(transactionInfo);
    await registerTransaction(transactionInfo);
    const userTransactions = (await getUserById(transactionInfo.userId)).transactions;
    expect(userTransactions).toHaveLength(2);
  });
});
