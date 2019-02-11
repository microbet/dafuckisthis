import React, { Component } from 'react';
import MainPic from './components/MainPic';
import Login from './components/Login';
import Register from './components/Register';
import User from './User';
import './App.css';
// import Leaderboard from './components/Leaderboard';

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
			 // <Leaderboard DATA_URI={DATA_URI} user={this.state.user} />
    return (
      <div className="App">
          <Login DATA_URI={DATA_URI} user={this.state.user} refresh={this.refresh} />
	   <MainPic DATA_URI={DATA_URI} selectedImage='latest' user={this.state.user} refresh={this.refresh} answerToggle={this.state.answerToggle} />
			  { this.state.user.userId ? null : <Register DATA_URI={DATA_URI} /> }
      </div>
    );
  }
}

export default App;

// TODO: resize the images automatically, done, could be done better maybe
// TODO: you should be able to go to a specific image, even 
// if it's just for testing/admin
// TODO: thumbup or down shouldn't show on the leader answers? or you should be able to vote - probably should be able to vote
// TODO: any user, logged in, should be able to see just their pictures.  If this is going to be used for storage - it might not be able to be free
