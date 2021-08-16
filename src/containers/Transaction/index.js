import React from 'react';
import { useSelector } from 'react-redux';
import Transaction from './Transaction';

const TransactionWrapper = () => {
  const { stockData } = useSelector((state) => state.stock);
  return <Transaction stockExchangeData={stockData} />;
};

export default TransactionWrapper;
