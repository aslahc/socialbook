import React from 'react';
import { BrowserRouter } from "react-router-dom";

import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer,  } from 'react-toastify';

import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';

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
    <App />
    <ToastContainer />

    </PersistGate>
  </Provider>,

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals



// import React from 'react';
// import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import store from '../src/utils/store'; // assuming this is where your Redux store is defined
// import { persistStore } from 'redux-persist'; // Import persistStore from redux-persist
// import App from './App'; // assuming this is your main App component

// ReactDOM.render(
//   <Provider store={store}>
//     <PersistGate loading={null} persistor={persistStore(store)}>
//       <App />
//     </PersistGate>
//   </Provider>,
//   document.getElementById('root')
// );
