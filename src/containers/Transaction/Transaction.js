import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import * as Component from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './transaction.module.scss';
import Text from '../../components/Text';
import { makeExchange } from '../../redux/reducers/exchange/actions';

const defaultValues = {
  isBuying: true,
  currencyName: '',
  price: '',
  amount: 0,
  total: ''
};

export const errorMessages = {
  required: 'The field is required',
  typeError: 'Value must be a number',
  min: 'Amount must be a positive number'
};

const schema = yup.object().shape({
  currencyName: yup
    .string()
    .required(errorMessages.required),
  amount: yup
    .number(errorMessages.typeError)
    .positive(errorMessages.min)
    .transform((val) => (Number.isNaN(val) ? undefined : val))
    .required(errorMessages.required)
});

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

  const [isBuying, currencyName, amount] = [watch('isBuying'), watch('currencyName'), watch('amount')];
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    const { amount, currencyName, isBuying, price } = data;

    // TODO: this is temporary ID and should be replaced by real user ID
    dispatch(makeExchange({ userId: 1, amount, currencyName, isBuying, price }));
  };

  useEffect(() => {
    setValue('price', stockExchangeData.find((dataItem) => dataItem.name === currencyName)?.price || '');
  }, [currencyName, stockExchangeData]);

  useEffect(() => {
    if (amount && currencyName && !errors.amount) {
      const total = stockExchangeData.find((dataItem) => dataItem.name === currencyName)?.price * getValues('amount');
      setValue('total', parseFloat(total.toFixed(2)));
    }
  }, [amount, currencyName, errors.amount, stockExchangeData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
      <div className={styles.heading}>
        <Text text="Transaction Type:" type="HEADING_5" />
        <Text text={isBuying ? 'Buy' : 'Sell'} type="HEADING_5" state={isBuying ? 'SUCCESS' : 'ACCENT'} />
        <Controller
          name="isBuying"
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
        <Component.FormControl variant="outlined" error={!!errors.currencyName}>
          <Component.InputLabel id="currencyName">Name</Component.InputLabel>
          <Controller
            name="currencyName"
            control={control}
            render={({ field }) => (
              <Component.Select
                labelId="currencyName"
                id="currencyName"
                label="currencyName"
                inputProps={{ 'data-testid': 'currencyName' }}
                {...field}
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
            {errors.currencyName?.message}
          </Component.FormHelperText>
        </Component.FormControl>
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <Component.TextField
              id="price"
              label="Price"
              variant="outlined"
              disabled
              {...field}
            />
          )}
        />
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <Component.TextField
              id="amount"
              type="number"
              label="Amount"
              variant="outlined"
              error={!!errors.amount}
              helperText={errors.amount?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="total"
          control={control}
          render={({ field }) => (
            <Component.TextField
              id="total"
              label="Total"
              variant="outlined"
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
        <Component.Button variant="outlined" color="primary" onClick={() => reset(defaultValues)}>
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
