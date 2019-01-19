import React, { Component } from 'react';
import MainPic from './components/MainPic';
import Login from './components/Login';
import Register from './components/Register';
import User from './User';
import Leaderboard from './components/Leaderboard';

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
	if (this.state.answerToggle === 0) {
		this.setState({ answerToggle : 1 });
	} else {
		this.setState({ answerToggle : 0 });
	}
  }

  render() {
    return (
      <div className="App">
	   <MainPic DATA_URI={DATA_URI} selectedImage='latest' user={this.state.user} refresh={this.refresh} answerToggle={this.state.answerToggle} />
          <Login DATA_URI={DATA_URI} user={this.state.user} refresh={this.refresh} />
			  { this.state.user.userId ? null : <Register DATA_URI={DATA_URI} /> }
			  <Leaderboard />
      </div>
    );
  }
}

export default App;

