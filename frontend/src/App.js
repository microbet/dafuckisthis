import React, { Component } from 'react';
import MainPic from './components/MainPic';
import Login from './components/Login';
import Answers from './components/Answers';
import Register from './components/Register';
import User from './User';
import './App.css';
// import Leaderboard from './components/Leaderboard';
// I think I need to move all the components into here if I'm going to move them around
// based on window size

const DATA_URI = 'http://173.255.247.69:5000';

class App extends Component {
  constructor(props) {
    super(props);
    var user = new User();
    this.state = {
      user : user,
      answerToggle : 0,
      showLogin : true,
      appClass : 'App',
    }
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    if (window.innerWidth < 1000) {
      this.setState({ appClass : "Narrow-format" });
    } else {
      this.setState({ appClass : "Wide-format" });
    }
  }

  refresh = () => {
	if (this.state.answerToggle === 0) {
		this.setState({ answerToggle : 1 });
	} else {
		this.setState({ answerToggle : 0 });
	}
  }

  switchForm = (show) => {
    if (show === 'register') {
      this.setState({ showLogin : false });
    }
    if (show === 'login') {
      this.setState({ showLogin : true });
    }
  }

  render() {
			 // <Leaderboard DATA_URI={DATA_URI} user={this.state.user} />
    return (
      <div className={this.state.appClass}>
      { this.state.showLogin ? <Login DATA_URI={DATA_URI} user={this.state.user} switchForm={this.switchForm} refresh={this.refresh} /> 
        :
        <Register DATA_URI={DATA_URI} switchForm={this.switchForm} refresh={this.refresh} /> }

	   <MainPic DATA_URI={DATA_URI} selectedImage='latest' user={this.state.user} refresh={this.refresh} answerToggle={this.state.answerToggle} />




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
