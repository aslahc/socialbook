import React from 'react';
import { BrowserRouter } from "react-router-dom";

import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer, } from 'react-toastify';

import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import store from '../src/utils/store'
import { persistStore } from 'redux-persist'; // Import persistStore from redux-persist

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <GoogleOAuthProvider clientId="1005695494942-ogm8cd30tnavtcg1cqngos2n7to1rllv.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>;
        <ToastContainer />

      </PersistGate>
    </Provider>,

  </React.StrictMode>
);

