import React, { Component } from 'react';
import MainPic from './components/MainPic';
import Login from './components/Login';
import Register from './components/Register';

const DATA_URI = 'http://173.255.247.69:5000';

class App extends Component {
  render() {
    return (
      <div className="App">
	   <MainPic DATA_URI={DATA_URI} selectedImage='latest' />
          <Login DATA_URI={DATA_URI} />
          <Register DATA_URI={DATA_URI} />
      </div>
    );
  }
}

export default App;
