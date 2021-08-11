import { DateTime } from 'luxon';
import { getUserById, setUser } from '../../services/databaseService';

const appendTransactionToProfile = (profile, transaction) => {
  profile.transactions = [...profile.transactions, transaction];
};

const registerTransaction = async (transactionInfo, error) => {
  const newTransactionRecord = { time: DateTime.now().toISO(), transactionInfo, error: error?.message ?? error };

  const profile = await getUserById(transactionInfo.userId);
  appendTransactionToProfile(profile, newTransactionRecord);

  await setUser(profile);
};

export default registerTransaction;
