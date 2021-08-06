import walletService from './walletService';
import { BASE_CURRENCY } from '../utils/constants';
import { NotEnoughFundsError } from '../utils/errors';

export const validateIfUserHasSufficientFunds = async ({ userId, wallet, currencyName, amountToPay }) => {
  const availableFunds = await wallet.getFunds({ userId, currencyName });

  if (availableFunds < amountToPay) {
    throw new NotEnoughFundsError();
  }
};

export const exchangeCrypto = async ({ userId, wallet, currencyToBuy, currencyToPay, amountToBuy, amountToPay }) => {
  await validateIfUserHasSufficientFunds({ userId, wallet, currencyName: currencyToPay, amountToPay });

  await wallet.addFunds({ userId, currencyName: currencyToBuy, amount: amountToBuy });
  await wallet.subtractFunds({ userId, currencyName: currencyToPay, amount: amountToPay });
};

export default ((wallet = walletService) => ({
  async buyCrypto({ userId, currencyName, amount, price }) {
    await exchangeCrypto({
      userId,
      wallet,
      currencyToBuy: currencyName,
      currencyToPay: BASE_CURRENCY,
      amountToBuy: amount,
      amountToPay: amount * price
    });
  },

  async sellCrypto({ userId, currencyName, amount, price }) {
    await exchangeCrypto({
      userId,
      wallet,
      currencyName,
      currencyToBuy: BASE_CURRENCY,
      currencyToPay: currencyName,
      amountToBuy: amount * price,
      amountToPay: amount
    });
  }
}))();
