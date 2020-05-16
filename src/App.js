import React from 'react';
import { Provider } from 'react-redux';

import Header from './Header/Header';
import Table from './Table/Table';
import store from './Redux';

class App extends React.Component {
  render () {
    return (
      <>
      <Provider store={store}>
        <Header />
        <Table />
      </Provider>
      </>
    );
  }
}

export default App;
