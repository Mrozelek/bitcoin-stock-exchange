import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Transaction from '../Transaction';
import Table from '../CurrencyTable';
import { wrapper, table, transaction, spinner } from './marketPage.module.scss';
import { getTickers } from '../../redux/reducers/stock/actions';
import { API_CALL_INTERVAL } from '../../utils/constants';

let canShowSpinner;

const MarketPage = () => {
  const dispatch = useDispatch();
  const { isLoading, stockData } = useSelector((state) => state.stock);

  useEffect(() => {
    canShowSpinner = true;

    dispatch(getTickers());
    const apiCallIntervalID = setInterval(() => dispatch(getTickers()), API_CALL_INTERVAL);

    return () => {
      clearInterval(apiCallIntervalID);
    };
  }, []);

  if ((isLoading && canShowSpinner) || !stockData.length) {
    return <CircularProgress className={spinner} />;
  }

  canShowSpinner = false;

  return (
    <div className={wrapper}>
      <div className={table}>
        <Table />
      </div>
      <div className={transaction}>
        <Transaction />
      </div>
    </div>
  );
};

export default MarketPage;
