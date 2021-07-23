import { USERS_PROFILES } from '../utils/constants';
import { NO_SUCH_USER } from '../utils/errors';
import database from '../utils/database';

export const getUserById = async (userId) => (
  (await database.getItem(USERS_PROFILES)).find((user) => user.userId === userId)
);

const validateIfUserExists = async (userId) => {
  if (await getUserById(userId) === undefined) {
    throw new Error(NO_SUCH_USER);
  }
};

const calculateNewFunds = async ({ userId, wallet, currencyName, amount }) => {
  const oldFunds = await wallet.getFunds({ userId, currencyName });
  return oldFunds + amount;
};

const updateFunds = async ({ userId, wallet, currencyName, amount }) => {
  await validateIfUserExists(userId);

  const usersProfiles = await database.getItem(USERS_PROFILES);
  const userIndex = usersProfiles.findIndex((user) => user.userId === userId);

  const newFunds = await calculateNewFunds({ userId, wallet, currencyName, amount });
  usersProfiles[userIndex].funds[currencyName] = newFunds;

  await database.setItem(USERS_PROFILES, usersProfiles);
};

const walletService = {
  async getFunds({ userId, currencyName }) {
    await validateIfUserExists(userId);

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
