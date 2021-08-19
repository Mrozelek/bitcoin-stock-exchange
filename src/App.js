import React, { useEffect } from 'react';
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
import { exchangeRoute, transactionHistoryRoute } from './utils/routes';
import useUserId from './hooks/useUserId';

const App = () => {
  const [userId] = useUserId();

  useEffect(() => {
    databaseService.setItem(USERS_PROFILES_KEY, [{
      userId,
      funds: {
        ETH: 5,
        USD: 10
      },
      transactions: []
    }]);
  }, []);

  return (
    <div className={wrapper}>
      <SiteHeading />
      <Switch>
        <Redirect exact from="/" to={`${exchangeRoute}/${DEFAULT_CRYPTO}`} />
        <Route path={`${exchangeRoute}/:currency?`}>
          <MarketPage />
          <Route path={`${exchangeRoute}/:currency?${transactionHistoryRoute}`}>
            <TransactionHistoryModal />
          </Route>
        </Route>
      </Switch>
    </div>
  );
};

export default App;
