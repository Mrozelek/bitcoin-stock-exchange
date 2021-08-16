import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import CurrencyTable from './CurrencyTable';

const useStyles = makeStyles(() => ({
  center: {
    display: 'flex',
    justifyContent: 'center'
  }
}));

let canShowSpinner;
let stockDataPrev = [];

const CurrencyTableWrapper = () => {
  const { isLoading, isError, stockData } = useSelector((state) => state.stock);
  const classes = useStyles();

  useEffect(() => {
    canShowSpinner = true;
  }, []);

  if (isLoading && canShowSpinner) {
    canShowSpinner = false;
    return <div className={classes.center}><CircularProgress /></div>;
  }

  if (isError || isLoading) {
    return <CurrencyTable stockExchangeData={stockDataPrev} />;
  }

  stockDataPrev = stockData;
  return <CurrencyTable stockExchangeData={stockData} />;
};

export default CurrencyTableWrapper;
