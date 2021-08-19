import React from 'react';
import {
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import databaseService from './services/databaseService';
import { USERS_PROFILES_KEY, DEFAULT_CRYPTO } from './utils/constants';
import SiteHeading from './containers/SiteHeading';
import MarketPage from './containers/MarketPage';
import TransactionHistoryModal from './containers/TransactionHistoryModal';
import { wrapper } from './App.module.scss';

const App = () => {
  databaseService.setItem(USERS_PROFILES_KEY, [{
    userId: 1,
    funds: {
      ETH: 5,
      USD: 10
    },
    transactions: []
  }]);

  return (
    <div className={wrapper}>
      <SiteHeading />
      <Switch>
        <Redirect exact from="/" to={`/exchange/${DEFAULT_CRYPTO}`} />
        <Route path="/exchange/:currency?">
          <MarketPage />
          <Route path="/exchange/:currency?/transactionHistory" component={TransactionHistoryModal} />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
