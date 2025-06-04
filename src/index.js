import 'react-app-polyfill/ie11'; // For IE 11 support
import 'react-app-polyfill/stable';
import 'core-js';
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './input.css'
import "./output.css";

import { icons } from './assets/icons'

import { Provider } from 'react-redux'
import store from './store'
import { QueryClient, QueryClientProvider } from 'react-query';

React.icons = icons
const queryClient = new QueryClient({
  defaultOptions: {
    // queries: {
    //   staleTime: 1000 * 60 * 5,
    //   refetchOnWindowFocus: false,
    //   refetchOnReconnect: true,
    //   retry: 3,
    // },
    // mutations: {
    //   retry: 3,
    //   retryDelay: 100 * 60 * 1
    // },
  },
});

ReactDOM.render(

  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />
    </Provider>
  </QueryClientProvider>,

  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
