import { getUserById, setUser } from './databaseService';

const calculateNewFunds = async ({ userId, wallet, currency, amount }) => {
  const oldFunds = await wallet.getFunds({ userId, currency });
  return oldFunds + amount;
};

const setProfileFunds = ({ profile, newFunds, currency }) => {
  profile.funds[currency] = newFunds;
};

const updateFunds = async ({ userId, wallet, currency, amount }) => {
  const newFunds = await calculateNewFunds({ userId, wallet, currency, amount });

  const profile = await getUserById(userId);
  setProfileFunds({ profile, newFunds, currency });

  await setUser(profile);
};

const walletService = {
  async getFunds({ userId, currency }) {
    const userFunds = (await getUserById(userId)).funds;
    return currency ? userFunds[currency] ?? 0 : userFunds;
  },

  async addFunds({ userId, currency, amount }) {
    await updateFunds({ userId, wallet: walletService, currency, amount });
  },

  async subtractFunds({ userId, currency, amount }) {
    await updateFunds({ userId, wallet: walletService, currency, amount: -amount });
  }
};

export default walletService;
