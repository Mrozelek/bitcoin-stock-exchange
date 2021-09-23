import React from 'react';
import { useSelector } from 'react-redux';
import TransactionHistoryModal from './TransactionHistoryModal';

const TransactionHistoryModalWrapper = () => {
  const { transactionRecords } = useSelector((state) => state.exchange);
  return <TransactionHistoryModal transactions={transactionRecords} />;
};

export default TransactionHistoryModalWrapper;
