import React from 'react';
import * as Component from '@material-ui/core';
import Text from '../../components/Text';
import styles from './siteHeading.module.scss';

const SiteHeading = () => (
  <div className={styles.wrapper}>
    <Text text="Cryptocurrency stock exchange" type="HEADING_3" state="ACCENT" />
    <div className={styles.buttonContainer}>
      <Component.Button variant="outlined" color="primary">
        Log in
      </Component.Button>
      <Component.Button variant="contained" color="primary">
        Register
      </Component.Button>
    </div>
  </div>
);

export default SiteHeading;
