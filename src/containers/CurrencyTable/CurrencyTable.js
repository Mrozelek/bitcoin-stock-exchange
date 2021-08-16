import React from 'react';
import * as Component from '@material-ui/core';
import PropTypes from 'prop-types';
import colors from '../../utils/colors';
import { BASE_CURRENCY } from '../../utils/constants';

const roundNumber = (number) => (Math.round(number * 100) / 100).toFixed(2);

const formatIntegerPart = (number) => {
  const integerNumbers = number.split('.')[0].split('');

  let i = 0;
  const numberFormatted = integerNumbers.reduceRight((acc, curr) => (
    ((++i % 3 === 0 && i !== integerNumbers.length) ? `,${curr}` : curr).concat(acc)
  ), '');

  return `${numberFormatted}.${number.split('.')[1]}`;
};

const formatPrice = (price) => {
  const priceRounded = roundNumber(price);
  const priceFormatted = formatIntegerPart(priceRounded);

  return `${priceFormatted} ${BASE_CURRENCY}`;
};

const formatChange = (change) => {
  const changeRounded = roundNumber(change);
  return changeRounded >= 0 ? `+${changeRounded}%` : `${changeRounded}%`;
};

const formatCap = (cap) => {
  const capRounded = roundNumber(cap);
  const capFormatted = formatIntegerPart(capRounded);

  return !cap ? 'Unknown' : `${capFormatted}M ${BASE_CURRENCY}`;
};

const formatStockExchangeData = (stockExchangeData) => (
  stockExchangeData.map((dataItem) => (
    {
      ...dataItem,
      price: formatPrice(dataItem.price),
      change: formatChange(dataItem.change),
      cap: formatCap(dataItem.cap)
    }
  ))
);

const CurrencyTable = ({ stockExchangeData }) => {
  const stockExchangeDataFormatted = formatStockExchangeData(stockExchangeData || []);

  return (
    <Component.TableContainer component={Component.Paper}>
      <Component.Table aria-label="simple table">
        <Component.TableHead>
          <Component.TableRow>
            <Component.TableCell />
            <Component.TableCell>Name</Component.TableCell>
            <Component.TableCell align="right">Current Price</Component.TableCell>
            <Component.TableCell align="right">24h Change</Component.TableCell>
            <Component.TableCell align="right">Market Cap</Component.TableCell>
          </Component.TableRow>
        </Component.TableHead>
        <Component.TableBody>
          {stockExchangeDataFormatted.map((dataItem) => (
            <Component.TableRow key={dataItem.uuid}>
              <Component.TableCell component="th" scope="row">
                <Component.Avatar alt={dataItem.name} src={dataItem.imageUrl} />
              </Component.TableCell>
              <Component.TableCell component="th" scope="row">{dataItem.name}</Component.TableCell>
              <Component.TableCell align="right">{dataItem.price}</Component.TableCell>
              <Component.TableCell
                style={dataItem.change[0] === '+' ? { color: colors.success } : { color: colors.error }}
                align="right"
              >
                {dataItem.change}
              </Component.TableCell>
              <Component.TableCell align="right">{dataItem.cap}</Component.TableCell>
            </Component.TableRow>
          ))}
        </Component.TableBody>
      </Component.Table>
    </Component.TableContainer>
  );
};

export default CurrencyTable;

CurrencyTable.propTypes = {
  stockExchangeData: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.number,
    change: PropTypes.number,
    cap: PropTypes.number
  })).isRequired
};
