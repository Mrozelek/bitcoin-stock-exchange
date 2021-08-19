import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import { useHistory } from 'react-router-dom';

const getScrollbarWidth = () => {
  const inner = document.createElement('p');
  inner.style.width = '100%';
  inner.style.height = '200px';

  const outer = document.createElement('div');
  outer.style.position = 'absolute';
  outer.style.top = '0px';
  outer.style.left = '0px';
  outer.style.visibility = 'hidden';
  outer.style.width = '200px';
  outer.style.height = '150px';
  outer.style.overflow = 'hidden';
  outer.appendChild(inner);

  document.body.appendChild(outer);
  const w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  let w2 = inner.offsetWidth;
  if (w1 === w2) {
    w2 = outer.clientWidth;
  }

  document.body.removeChild(outer);

  return (w1 - w2);
};

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
    width: 765,
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
    minWidth: 160
  }
];

const TransactionHistoryModal = () => {
  const classes = useStyles();
  const history = useHistory();

  const [rows, setRows] = useState([]);

  const updateRoute = () => {
    history.push(history.location.pathname.slice(0, -18));
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${getScrollbarWidth()}px`;

    setRows([
      { id: 1, currency: 'XRP', amount: 1, price: '1.1000', action: 'Buy', time: '2021-08-19 14:24:58' },
      { id: 2, currency: 'XRP', amount: 1, price: '1.1000', action: 'Buy', time: '2021-08-19 14:24:58' },
      { id: 3, currency: 'XRP', amount: 1, price: '1.1000', action: 'Buy', time: '2021-08-19 14:24:58' },
      { id: 4, currency: 'XRP', amount: 1, price: '1.1000', action: 'Buy', time: '2021-08-19 14:24:58' },
      { id: 5, currency: 'XRP', amount: 1, price: '1.1000', action: 'Buy', time: '2021-08-19 14:24:58' },
      { id: 6, currency: 'XRP', amount: 1, price: '1.1000', action: 'Buy', time: '2021-08-19 14:24:58' },
      { id: 7, currency: 'XRP', amount: 1, price: '1.1000', action: 'Buy', time: '2021-08-19 14:24:58' },
      { id: 8, currency: 'XRP', amount: 1, price: '1.1000', action: 'Buy', time: '2021-08-19 14:24:58' },
      { id: 9, currency: 'XRP', amount: 1, price: '1.1000', action: 'Buy', time: '2021-08-19 14:24:58' }
    ]);

    return (() => {
      document.body.style.overflow = 'visible';
      document.body.style.paddingRight = 0;
    });
  }, []);

  const handleClose = () => {
    updateRoute();
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
          rows={rows}
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
