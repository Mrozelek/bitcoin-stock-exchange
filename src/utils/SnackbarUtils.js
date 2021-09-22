import { useSnackbar } from 'notistack';
import React from 'react';

const InnerSnackbarUtilsConfigurator = ({ setUseSnackbarRef }) => {
  setUseSnackbarRef(useSnackbar());
  return null;
};

let useSnackbarRef;
const setUseSnackbarRef = (useSnackbarRefProp) => {
  useSnackbarRef = useSnackbarRefProp;
};

export const SnackbarUtilsConfigurator = () => <InnerSnackbarUtilsConfigurator setUseSnackbarRef={setUseSnackbarRef} />;

export const snackActions = {
  success(msg) {
    this.toast(msg, { variant: 'success' });
  },
  warning(msg) {
    this.toast(msg, { variant: 'warning' });
  },
  info(msg) {
    this.toast(msg, { variant: 'info' });
  },
  error(msg) {
    this.toast(msg, { variant: 'error' });
  },
  toast(msg, options = {}) {
    useSnackbarRef.enqueueSnackbar(msg, options);
  },
  dismiss(key) {
    useSnackbarRef.closeSnackbar(key);
  }
};
