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
			  <Leaderboard DATA_URI={DATA_URI} />
      </div>
    );
  }
}

export default App;

// TODO: if the picture is too big and the screen is too small you can't close the modal
// TODO: resize the images automatically, done, could be done better maybe
// TODO: the mostupvoted list doesn't update automatically upon voting
// it also doesn't show any that have zero upvotes, but some downvotes
// should just be order of favorability
