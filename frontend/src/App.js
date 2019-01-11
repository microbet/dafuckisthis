import React, { Component } from 'react';
import MainPic from './components/MainPic';

const DATA_URI = 'http://173.255.247.69:5000';

class App extends Component {
  render() {
    return (
      <div className="App">
	   <MainPic DATA_URI={DATA_URI} selectedImage='latest' />
      There has to be users/authentication in order to have voting
      </div>
    );
  }
}

export default App;
