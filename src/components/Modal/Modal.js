import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

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

const Modal = ({ children, show, onClose }) => {
  const classes = useStyles();

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.body.clientWidth;
    document.body.style.marginRight = `${scrollbarWidth}px`;
    document.body.style.overflow = 'hidden';

    return (() => {
      document.body.style.marginRight = '';
      document.body.style.overflow = '';
    });
  }, []);

  const handleCloseByEscape = (evt) => {
    if ((evt.charCode || evt.keyCode) === 27) {
      onClose();
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div
      className={classes.modalBackground}
      role="button"
      tabIndex="0"
      onClick={onClose}
      onKeyDown={handleCloseByEscape}
    >
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;

Modal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  show: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

Modal.defaultProps = { show: false };
