import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import * as Component from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as capitalize from 'capitalize';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import styles from './transaction.module.scss';
import Text from '../../components/Text';
import { makeExchange } from '../../redux/reducers/exchange/actions';

const fields = {
  isBuying: 'isBuying',
  currency: 'currency',
  price: 'price',
  amount: 'amount',
  total: 'total'
};

const defaultValues = {
  [fields.isBuying]: true,
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

  const isBuying = watch(fields.isBuying);

  const isCurrencyAvailable = (name) => stockExchangeData.some((currency) => currency.name === name);

  const getLocationWithoutCurrency = () => (
    currencyUrlParam ? location.pathname.slice(0, -currencyUrlParam.length) : location.pathname
  );

  useEffect(() => {
    if (isCurrencyAvailable(currencyUrlParam?.toUpperCase())) {
      setValue(fields.currency, currencyUrlParam.toUpperCase());
    } else {
      history.push(`${getLocationWithoutCurrency()}${getValues(fields.currency)}`);
    }
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

  const updateFields = () => {
    updatePrice();
    updateTotal();
  };

  useEffect(() => {
    updateFields();
  }, [stockExchangeData]);

  const onReset = () => {
    reset(defaultValues);

    const locationWithoutCurrency = getLocationWithoutCurrency();
    if (location !== locationWithoutCurrency) {
      history.push(`${locationWithoutCurrency}`);
    }
  };

  const onSubmit = ({ amount, currency, isBuying, price }) => {
    dispatch(makeExchange({ userId: 1, amount, currency, isBuying, price: parseFloat(price) }));
  };

  const onCurrencyChange = (evt) => {
    updateFields();

    const currency = evt.target.value;
    history.push(`${getLocationWithoutCurrency()}${currency}`);
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
      <div className={styles.form}>
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
                updateFields();
              }}
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
