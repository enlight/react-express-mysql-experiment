import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

async function loadSchema() {
  const response = await fetch('/api/schemas?id=order', {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`Server error: ${response.status}`);
  }
}

async function main() {
  const orderSchema = await loadSchema();
  ReactDOM.render(<App orderSchema={orderSchema} />, document.getElementById('root'));
  registerServiceWorker();
}

main();
