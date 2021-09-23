import { getUserById } from '../../../services/databaseService';
import transactionService from '../../../services/transactionService';
import { snackActions } from '../../../utils/SnackbarUtils';

const EXCHANGE_SUCCESS_MESSAGE = 'Exchange successful';

export const EXCHANGE_MAKE_INIT = 'exchange/make/init';
export const EXCHANGE_MAKE_SUCCESS = 'exchange/make/success';
export const EXCHANGE_MAKE_FAILURE = 'exchange/make/failure';
export const FETCH_TRANSACTIONS = 'exchange/fetchTransactions';

export const makeExchangeInit = () => ({ type: EXCHANGE_MAKE_INIT });

export const makeExchangeFail = (transactionInfo, error) => ({
  type: EXCHANGE_MAKE_FAILURE,
  payload: { transactionInfo, error }
});

export const makeExchangeSuccess = (transactionInfo) => ({
  type: EXCHANGE_MAKE_SUCCESS,
  payload: { transactionInfo }
});

export const fetchTransactionsAction = (transactionRecords) => ({
  type: FETCH_TRANSACTIONS,
  payload: { transactionRecords }
});

export const makeExchange = (transactionInfo) => async (dispatch) => {
  dispatch(makeExchangeInit());
  try {
    if (transactionInfo.isBuying) {
      await transactionService().buyCrypto(transactionInfo);
    } else {
      await transactionService().sellCrypto(transactionInfo);
    }
    dispatch(makeExchangeSuccess(transactionInfo));
    snackActions.success(EXCHANGE_SUCCESS_MESSAGE);
  } catch (error) {
    dispatch(makeExchangeFail(transactionInfo, error.message));
    snackActions.error(error.message);
  }
};

export const fetchTransactions = (userId) => async (dispatch) => {
  const transactionRecords = (await getUserById(userId)).transactions;
  dispatch(fetchTransactionsAction(transactionRecords));
};
