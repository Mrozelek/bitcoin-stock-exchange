import { DateTime } from 'luxon';
import databaseService from '../../services/databaseService';
import { TRANSACTIONS_HISTORY_KEY } from '../../utils/constants';

const registerTransaction = async (transactionInfo, error) => {
  const transactionsHistory = await databaseService.getItem(TRANSACTIONS_HISTORY_KEY) ?? [];
  const newTransactionQuery = { time: DateTime.now().toISO(), transactionInfo, error: error?.message ?? error };
  const newTransactionsHistory = [newTransactionQuery, ...transactionsHistory];
  await databaseService.setItem(TRANSACTIONS_HISTORY_KEY, newTransactionsHistory);
};

export default registerTransaction;
