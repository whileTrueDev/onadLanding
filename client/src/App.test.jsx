import React from 'react';
import ReactDOM from 'react-dom';
import LandingPage from './pages/Landing';

function setTitle(title = String) {
  return `Render without crashing - ${title}`;
}

test(setTitle('Landing Page'), () => {
  const div = document.createElement('div');
  ReactDOM.render(<LandingPage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
