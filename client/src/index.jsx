import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
// Pages
import LandingPage from './pages/Landing';

import * as serviceWorker from './serviceWorker';

const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <Route
      path="/"
      exact
      component={() => (
        <div>
          <script crossOrigin="anonymous" async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            minWidth: 160,
            maxWidth: 320,
            height: '100%',
            alignItems: 'center',
            flexDirection: 'column'
          }}
          >
            <h1>구글애드센스 테스트</h1>
            <ins
              className="adsbygoogle"
              style={{ display: 'inline-block', width: '160px', height: '600px' }}
              data-ad-client="ca-pub-4320356355619389"
              data-ad-slot
            />
          </div>
        </div>
      )}
    />
    <Route path="/:name" component={LandingPage} />
  </Router>, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
