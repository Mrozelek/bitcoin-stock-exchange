import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import { useHistory } from 'react-router-dom';
import { DateTime } from 'luxon';
import { getUserById } from '../../services/databaseService';
import { getScrollbarWidth } from '../../utils/utils';

const useStyles = makeStyles((theme) => ({
  modalBackground: {
    position: 'fixed',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1
  },
  modal: {
    width: 830,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2)
  }
}));

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    minWidth: 90
  },
  {
    field: 'currency',
    headerName: 'Currency',
    minWidth: 140
  },
  {
    field: 'amount',
    headerName: 'Amount',
    type: 'number',
    minWidth: 130
  },
  {
    field: 'price',
    headerName: 'Price',
    minWidth: 110
  },
  {
    field: 'action',
    headerName: 'Action',
    minWidth: 120
  },
  {
    field: 'time',
    headerName: 'Time',
    minWidth: 225
  }
];

const mapTransactionsToGridData = (transactions) => {
  let id = 1;
  return transactions.map(({ time, transactionInfo, error }) => {
    const { currency, amount, price, isBuying } = transactionInfo;
    const getAction = () => {
      const action = isBuying ? 'Buy' : 'Sell';
      return error ? `${action} (Failed)` : action;
    };
    return {
      id: id++,
      currency,
      amount,
      price: price.toFixed(4),
      action: getAction(),
      time: DateTime.fromISO(time).toHTTP()
    };
  });
};

const TransactionHistoryModal = () => {
  const classes = useStyles();
  const history = useHistory();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${getScrollbarWidth()}px`;

    const setUserTransactions = async (userId) => {
      setTransactions((await getUserById(userId)).transactions);
    };
    setUserTransactions(1);

    return (() => {
      document.body.style.overflow = 'visible';
      document.body.style.paddingRight = 0;
    });
  }, []);

  const handleClose = () => {
    history.push(history.location.pathname.slice(0, -18));
  };

  const handleCloseByEscape = (evt) => {
    if ((evt.charCode || evt.keyCode) === 27) {
      handleClose();
    }
  };

  return (
    <div
      className={classes.modalBackground}
      role="button"
      tabIndex="0"
      onClick={handleClose}
      onKeyDown={handleCloseByEscape}
    >
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
        <DataGrid
          rows={mapTransactionsToGridData(transactions)}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
          autoHeight
        />
      </div>
    </div>
  );
};

export default TransactionHistoryModal;
