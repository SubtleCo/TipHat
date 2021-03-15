import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { TipHat } from './TipHat';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <TipHat />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);