import databaseService from './databaseService';
import walletService from './walletService';
import { USERS_PROFILES_KEY } from '../utils/constants';

const userProfile = {
  userId: 1,
  funds: {
    USD: 1,
    ETH: 100
  }
};

describe('getFunds function', () => {
  beforeAll(async () => {
    userProfile.funds = {
      USD: 50,
      ETH: 100
    };
    await databaseService.setItem(USERS_PROFILES_KEY, [userProfile]);
  });

  it('should return amount of currency correctly', async () => {
    expect(await walletService.getFunds({ userId: 1, currencyName: 'ETH' })).toBe(100);
  });

  it('should return 0 if user have no such currency', async () => {
    expect(await walletService.getFunds({ userId: 1, currencyName: 'BTC' })).toBe(0);
  });

  it('should return all funds', async () => {
    expect(await walletService.getFunds({ userId: 1 })).toStrictEqual({ USD: 50, ETH: 100 });
  });
});

describe('addFunds function', () => {
  beforeEach(async () => {
    userProfile.funds = {
      USD: 50,
      ETH: 100
    };
    await databaseService.setItem(USERS_PROFILES_KEY, [userProfile]);
  });

  it('should add currency successfully', async () => {
    await walletService.addFunds({ userId: 1, currencyName: 'ETH', amount: 20 });
    expect((await databaseService.getItem(USERS_PROFILES_KEY))[0].funds).toStrictEqual({ USD: 50, ETH: 120 });
  });
});

describe('subtractFunds function', () => {
  beforeEach(async () => {
    userProfile.funds = {
      USD: 50,
      ETH: 100
    };
    await databaseService.setItem(USERS_PROFILES_KEY, [userProfile]);
  });

  it('should subtract currency successfully', async () => {
    await walletService.subtractFunds({ userId: 1, currencyName: 'USD', amount: 20 });
    expect((await databaseService.getItem(USERS_PROFILES_KEY))[0].funds).toStrictEqual({ USD: 30, ETH: 100 });
  });
});
