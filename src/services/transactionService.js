import walletService from './walletService';
import { BASE_CURRENCY } from '../utils/constants';
import { NotEnoughFundsError } from '../utils/errors';

export const validateIfUserHasSufficientFunds = async ({ userId, wallet, currency, amountToPay }) => {
  const availableFunds = await wallet.getFunds({ userId, currency });

  if (availableFunds < amountToPay) {
    throw new NotEnoughFundsError();
  }
};

export const exchangeCrypto = async ({ userId, wallet, currencyToBuy, currencyToPay, amountToBuy, amountToPay }) => {
  await validateIfUserHasSufficientFunds({ userId, wallet, currency: currencyToPay, amountToPay });

  await wallet.addFunds({ userId, currency: currencyToBuy, amount: amountToBuy });
  await wallet.subtractFunds({ userId, currency: currencyToPay, amount: amountToPay });
};

export default (wallet = walletService) => ({
  async buyCrypto({ userId, currency, amount, price }) {
    await exchangeCrypto({
      userId,
      wallet,
      currencyToBuy: currency,
      currencyToPay: BASE_CURRENCY,
      amountToBuy: amount,
      amountToPay: amount * price
    });
  },

  async sellCrypto({ userId, currency, amount, price }) {
    await exchangeCrypto({
      userId,
      wallet,
      currencyToBuy: BASE_CURRENCY,
      currencyToPay: currency,
      amountToBuy: amount * price,
      amountToPay: amount
    });
  }
});
