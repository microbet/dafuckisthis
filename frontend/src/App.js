import React, { Component } from 'react';
import MainPic from './components/MainPic';

// const DATA_URI = 'http://127.0.0.1:5000';
const DATA_URI = 'http://173.255.247.69:5000';
// const DATA_URI = 'http://192.168.1.220:5000';

class App extends Component {
  render() {
    return (
      <div className="App">
	   <MainPic DATA_URI={DATA_URI} selectedImage='latest' />
      </div>
    );
  }
}

export default App;
