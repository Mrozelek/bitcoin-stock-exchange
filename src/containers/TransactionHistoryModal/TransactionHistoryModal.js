import React, { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { useHistory, useLocation } from 'react-router-dom';
import { DateTime } from 'luxon';
import { getUserById } from '../../services/databaseService';
import Modal from '../../components/Modal/Modal';
import { transactionHistoryRoute } from '../../utils/routes';
import useUserId from '../../hooks/useUserId';

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

const mapTransactionsToGridData = (transactions) => (
  transactions.map(({ time, transactionInfo, error }, index) => {
    const { currency, amount, price, isBuying } = transactionInfo;

    const getAction = () => {
      const action = isBuying ? 'Buy' : 'Sell';
      return error ? `${action} (Failed)` : action;
    };

    return {
      id: index + 1,
      currency,
      amount,
      price: price.toFixed(4),
      action: getAction(),
      time: DateTime.fromISO(time).toHTTP()
    };
  })
);

const TransactionHistoryModal = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const [transactions, setTransactions] = useState([]);
  const [userId] = useUserId();

  useEffect(() => {
    const setUserTransactions = async (userId) => {
      setTransactions((await getUserById(userId)).transactions);
    };
    setUserTransactions(userId);
  }, []);

  const onClose = () => {
    history.push(pathname.replace(transactionHistoryRoute, ''));
  };

  return (
    <Modal show onClose={onClose}>
      <DataGrid
        rows={mapTransactionsToGridData(transactions)}
        columns={columns}
        pageSize={5}
        disableSelectionOnClick
        autoHeight
      />
    </Modal>
  );
};

export default TransactionHistoryModal;
