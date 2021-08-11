import { getUserById, setUser } from './databaseService';

const calculateNewFunds = async ({ userId, wallet, currencyName, amount }) => {
  const oldFunds = await wallet.getFunds({ userId, currencyName });
  return oldFunds + amount;
};

const setProfileFunds = ({ profile, newFunds, currencyName }) => {
  profile.funds[currencyName] = newFunds;
};

const updateFunds = async ({ userId, wallet, currencyName, amount }) => {
  const newFunds = await calculateNewFunds({ userId, wallet, currencyName, amount });

  const profile = await getUserById(userId);
  setProfileFunds({ profile, newFunds, currencyName });

  await setUser(profile);
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
