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
        <Route exact path="/">
          <Redirect to={`/exchange/${DEFAULT_CRYPTO}`} />
        </Route>
        <Route path="/exchange/:currency?" component={MarketPage} />
      </Switch>
    </div>
  );
};

export default App;
