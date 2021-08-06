import { USERS_PROFILES } from '../utils/constants';
import databaseService from './databaseService';

export const getUserById = async (userId) => (
  (await databaseService.getItem(USERS_PROFILES)).find((user) => user.userId === userId)
);

const calculateNewFunds = async ({ userId, wallet, currencyName, amount }) => {
  const oldFunds = await wallet.getFunds({ userId, currencyName });
  return oldFunds + amount;
};

const updateFunds = async ({ userId, wallet, currencyName, amount }) => {
  const usersProfiles = await databaseService.getItem(USERS_PROFILES);
  const userIndex = usersProfiles.findIndex((user) => user.userId === userId);

  const newFunds = await calculateNewFunds({ userId, wallet, currencyName, amount });
  usersProfiles[userIndex].funds[currencyName] = newFunds;

  await databaseService.setItem(USERS_PROFILES, usersProfiles);
};

const walletService = {
  async getFunds({ userId, currencyName }) {
    const userFunds = (await getUserById(userId)).funds;
    return currencyName ? userFunds[currencyName] ?? 0 : userFunds;
  },

  async addFunds({ userId, currencyName, amount }) {
    await updateFunds({ userId, wallet: walletService, currencyName, amount });
  },

  async subtractFunds({ userId, currencyName, amount }) {
    await updateFunds({ userId, wallet: walletService, currencyName, amount: -amount });
  }
};

export default walletService;
