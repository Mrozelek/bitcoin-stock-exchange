import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import * as Component from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import capitalize from 'capitalize';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import styles from './transaction.module.scss';
import Text from '../../components/Text';
import { makeExchange } from '../../redux/reducers/exchange/actions';
import { BASE_CURRENCY } from '../../utils/constants';
import { getUserById } from '../../services/databaseService';

export const fields = {
  isBuying: 'isBuying',
  base: 'base',
  crypto: 'crypto',
  currency: 'currency',
  price: 'price',
  amount: 'amount',
  total: 'total'
};

const defaultValues = {
  [fields.isBuying]: true,
  [fields.base]: '0.0000',
  [fields.crypto]: '0.0000',
  [fields.currency]: '',
  [fields.price]: '0.0000',
  [fields.amount]: 0,
  [fields.total]: '0.0000'
};

export const errorMessages = {
  required: 'The field is required',
  typeError: 'Value must be a number',
  min: 'Amount must be a positive number'
};

const schema = yup.object().shape({
  [fields.currency]: yup
    .string()
    .required(errorMessages.required),
  [fields.amount]: yup
    .number(errorMessages.typeError)
    .positive(errorMessages.min)
    .transform((val) => (Number.isNaN(val) ? undefined : val))
    .required(errorMessages.required)
});

const getCurrencyPrice = (
  { stockExchangeData, currency }
) => stockExchangeData.find((dataItem) => dataItem.name === currency).price.toFixed(4);

const calculateTotal = (
  { price, amount }
) => (price * amount).toFixed(4);

const Transaction = ({ stockExchangeData }) => {
  const {
    reset,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema)
  });

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { currency: currencyUrlParam } = useParams();

  const userId = 1;

  const isBuying = watch(fields.isBuying);

  const isCurrencyAvailable = (name) => stockExchangeData.some((currency) => currency.name === name);

  const getLocationWithoutCurrency = () => (
    currencyUrlParam ? location.pathname.slice(0, -currencyUrlParam.length) : location.pathname
  );

  const checkIfUrlParamIsValid = () => isCurrencyAvailable(currencyUrlParam?.toUpperCase());

  const updateRoute = () => {
    history.push(`${getLocationWithoutCurrency()}${getValues(fields.currency)}`);
  };

  const validateRoute = () => {
    if (checkIfUrlParamIsValid()) {
      setValue(fields.currency, currencyUrlParam.toUpperCase());
    } else if (currencyUrlParam) {
      updateRoute();
    }
  };

  const updateUserBase = async () => {
    const userFunds = (await getUserById(userId)).funds;
    const baseFunds = userFunds[BASE_CURRENCY].toFixed(4);
    defaultValues.base = baseFunds;
    setValue(fields.base, baseFunds);
  };

  const updateUserCrypto = async () => {
    if (getValues(fields.currency)) {
      const allFunds = (await getUserById(userId)).funds;
      const cryptoFunds = allFunds[getValues(fields.currency)]?.toFixed(4) || '0.0000';
      setValue(fields.crypto, cryptoFunds);
    }
  };

  useEffect(() => {
    validateRoute();
    updateUserBase();
    updateUserCrypto();
  }, []);

  const updatePrice = () => {
    const currency = getValues(fields.currency);
    if (currency) {
      setValue(fields.price, getCurrencyPrice({ stockExchangeData, currency }));
    } else {
      setValue(fields.price, defaultValues.price);
    }
  };

  const updateTotal = () => {
    const currency = getValues(fields.currency);
    if (currency && !errors.amount) {
      setValue(fields.total, calculateTotal({ price: getValues(fields.price), amount: getValues(fields.amount) }));
    } else {
      setValue(fields.total, defaultValues.total);
    }
  };

  useEffect(() => {
    updatePrice();
    updateTotal();
  }, [stockExchangeData]);

  const onReset = () => {
    reset(defaultValues);

    const locationWithoutCurrency = getLocationWithoutCurrency();
    if (location.pathname !== locationWithoutCurrency) {
      history.push(`${locationWithoutCurrency}`);
    }
  };

  const onSubmit = async ({ amount, currency, isBuying, price }) => {
    await dispatch(makeExchange({ userId, amount, currency, isBuying, price: parseFloat(price) }));
    updateUserBase();
    updateUserCrypto();
  };

  const onCurrencyChange = () => {
    updateRoute();
    updatePrice();
    updateTotal();
    updateUserCrypto();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
      <div className={styles.heading}>
        <Text text="Transaction Type:" type="HEADING_5" />
        <Text text={isBuying ? 'Buy' : 'Sell'} type="HEADING_5" state={isBuying ? 'SUCCESS' : 'ACCENT'} />
        <Controller
          name={fields.isBuying}
          control={control}
          render={({ field }) => (
            <Component.Switch
              color="primary"
              checked={field.value}
              inputProps={{ 'aria-label': 'primary checkbox' }}
              {...field}
            />
          )}
        />
      </div>
      <div className={styles.funds}>
        <Controller
          name={fields.crypto}
          control={control}
          render={({ field }) => (
            <Component.TextField
              id={fields.crypto}
              label="Available Crypto"
              variant="outlined"
              disabled
              {...field}
            />
          )}
        />
        <Controller
          name={fields.base}
          control={control}
          render={({ field }) => (
            <Component.TextField
              id={fields.base}
              label={`Available ${BASE_CURRENCY}`}
              variant="outlined"
              InputProps={{ startAdornment: <Component.InputAdornment position="start">$</Component.InputAdornment> }}
              disabled
              {...field}
            />
          )}
        />
      </div>
      <div className={styles.funds}>
        <Component.FormControl variant="outlined" error={!!errors.currency}>
          <Component.InputLabel id={fields.currency}>Currency</Component.InputLabel>
          <Controller
            name={fields.currency}
            control={control}
            render={({ field }) => (
              <Component.Select
                labelId={fields.currency}
                id={fields.currency}
                label={capitalize(fields.currency)}
                inputProps={{ 'data-testid': fields.currency }}
                {...field}
                onChange={(evt) => {
                  field.onChange(evt);
                  onCurrencyChange(evt);
                }}
              >
                {stockExchangeData.map((dataItem) => (
                  <Component.MenuItem key={dataItem.uuid} value={dataItem.name}>
                    {dataItem.name}
                  </Component.MenuItem>
                ))}
              </Component.Select>
            )}
          />
          <Component.FormHelperText>
            {errors.currency?.message}
          </Component.FormHelperText>
        </Component.FormControl>
        <Controller
          name={fields.amount}
          control={control}
          render={({ field }) => (
            <Component.TextField
              id={fields.amount}
              type="number"
              label={capitalize(fields.amount)}
              variant="outlined"
              error={!!errors.amount}
              helperText={errors.amount?.message}
              {...field}
              onChange={(evt) => {
                field.onChange(evt);
                updatePrice();
                updateTotal();
              }}
            />
          )}
        />
      </div>
      <div className={styles.funds}>
        <Controller
          name={fields.price}
          control={control}
          render={({ field }) => (
            <Component.TextField
              id={fields.price}
              label={capitalize(fields.price)}
              variant="outlined"
              InputProps={{ startAdornment: <Component.InputAdornment position="start">$</Component.InputAdornment> }}
              disabled
              {...field}
            />
          )}
        />
        <Controller
          name={fields.total}
          control={control}
          render={({ field }) => (
            <Component.TextField
              id={fields.total}
              label={capitalize(fields.total)}
              variant="outlined"
              InputProps={{ startAdornment: <Component.InputAdornment position="start">$</Component.InputAdornment> }}
              disabled
              {...field}
            />
          )}
        />
      </div>
      <div className={styles.buttonContainer}>
        <Component.Button disabled={!isValid} type="submit" variant="contained" color="primary">
          Confirm
        </Component.Button>
        <Component.Button variant="outlined" color="primary" onClick={onReset}>
          Reset
        </Component.Button>
      </div>
    </form>
  );
};

export default Transaction;

Transaction.propTypes = {
  stockExchangeData: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.number,
    change: PropTypes.number,
    cap: PropTypes.number
  })).isRequired
};
