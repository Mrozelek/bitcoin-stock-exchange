import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Transaction from '../Transaction';
import Table from '../CurrencyTable';
import { wrapper, table, transaction } from './marketPage.module.scss';
import { getTickers } from '../../redux/reducers/stock/actions';

const MarketPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTickers());
    const intervalID = setInterval(() => dispatch(getTickers()), 10000);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

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
