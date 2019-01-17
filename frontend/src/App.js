import React, { Component } from 'react';
import MainPic from './components/MainPic';
import Login from './components/Login';
import Register from './components/Register';
import User from './User';

const DATA_URI = 'http://173.255.247.69:5000';

class App extends Component {
  constructor() {
    super();
    var user = new User();
    this.state = {
      user : user,
      answerToggle : 0,
    }
  }

  refresh = () => {
    this.setState({ answerToggle : 1 });
    console.log("this happened");
  }

  render() {
    return (
      <div className="App">
	   <MainPic DATA_URI={DATA_URI} selectedImage='latest' user={this.state.user} refresh={this.refresh} answerToggle={this.state.answerToggle} />
          <Login DATA_URI={DATA_URI} user={this.state.user} refresh={this.refresh} />
          <Register DATA_URI={DATA_URI} />
      </div>
    );
  }
}

export default App;

