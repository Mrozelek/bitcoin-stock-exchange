import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Transaction from '../Transaction';
import Table from '../CurrencyTable';
import { wrapper, table, transaction, spinner } from './marketPage.module.scss';
import { getTickers } from '../../redux/reducers/stock/actions';
import { API_CALL_INTERVAL } from '../../utils/constants';

const MarketPage = () => {
  const dispatch = useDispatch();
  const { stockData } = useSelector((state) => state.stock);

  useEffect(() => {
    dispatch(getTickers());
    const apiCallIntervalID = setInterval(() => dispatch(getTickers()), API_CALL_INTERVAL);

    return () => {
      clearInterval(apiCallIntervalID);
    };
  }, []);

  if (!stockData.length) {
    return <CircularProgress className={spinner} />;
  }

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
