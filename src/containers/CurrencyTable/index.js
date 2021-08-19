import React from 'react';
import { useSelector } from 'react-redux';
import CurrencyTable from './CurrencyTable';

const CurrencyTableWrapper = () => {
  const { stockData } = useSelector((state) => state.stock);
  return <CurrencyTable stockExchangeData={stockData} />;
};

export default CurrencyTableWrapper;
