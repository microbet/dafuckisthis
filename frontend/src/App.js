import React, { Component } from 'react';
import './App.css';
import MainPic from './components/MainPic';
import Login from './components/Login';
import Answers from './components/Answers';
import Register from './components/Register';
import User from './User';
import Image from './Image';
// import Leaderboard from './components/Leaderboard';
// I think I need to move all the components into here if I'm going to move them around
// based on window size

var DATA_URI = '';
if (process.env.NODE_ENV === 'development') {
  DATA_URI = 'http://127.0.0.1:5000';
}

if (process.env.NODE_ENV === 'production') {
  DATA_URI = 'http://173.255.247.69:5000';
}

class App extends Component {
  constructor(props) {
    super(props);
    var user = new User();
    var image = new Image();
    this.state = {
      user : user,
      image : image,
      loading : 'initial',
      answerToggle : 0,
      showLogin : true,
    }
  }

  componentDidMount() {
    // needs work
   // if (!this.state.image.imageId) {
    this.setState({ loading : 'true' });
    this.state.image.requestImage('latest', DATA_URI).then(() => {
      this.setState( { loading : 'false' });
    })
   // }
  }

  setImage = (imageId) => {
    this.setState({ imageId : imageId });
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

    if (this.state.loading === 'initial') {
      return <h2>Intializing...</h2>;
    }


    if (this.state.loading === 'true') {
      return <h2>Loading...</h2>;
    }
			 // <Leaderboard DATA_URI={DATA_URI} user={this.state.user} />
    return (
      <div className="wrapper">
        <div>
      { this.state.showLogin ? <Login DATA_URI={DATA_URI} user={this.state.user} switchForm={this.switchForm} /> 
        :
        <Register DATA_URI={DATA_URI} switchForm={this.switchForm} /> }
        </div>
        <div>
	   <MainPic DATA_URI={DATA_URI} setImage={this.setImage} selectedImage='latest' user={this.state.user} answerToggle={this.state.answerToggle} />

        </div>
        <div>
      { this.state.image && <Answers imageId={this.state.user.imageId} DATA_URI={DATA_URI} user={this.state.user} trigger={this.state.trigger} unTriggerAnswers={this.unTriggerAnswers} triggerAnswers={this.triggerAnswers} answerToggle={this.props.answerToggle} />  }
        </div>
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
