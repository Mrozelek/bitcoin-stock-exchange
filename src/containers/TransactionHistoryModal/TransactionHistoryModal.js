import React, { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { DateTime } from 'luxon';
import { getUserById } from '../../services/databaseService';
import Modal from '../../components/Modal/Modal';
import { exchangeRoute } from '../../utils/routes';
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
  const history = useHistory();
  const [transactions, setTransactions] = useState([]);
  const { params: { currency } } = useRouteMatch();
  const [userId] = useUserId();

  useEffect(() => {
    const setUserTransactions = async (userId) => {
      setTransactions((await getUserById(userId)).transactions);
    };
    setUserTransactions(userId);
  }, []);

  const onClose = () => {
    history.push(currency ? `${exchangeRoute}/${currency}` : exchangeRoute);
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
