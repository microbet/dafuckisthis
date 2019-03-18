import React, { Component } from 'react';
import cookie from 'react-cookies';

class Login extends Component {

  handleUnameChange = event => {
    this.setState( { username: event.target.value } );
  }

  handlePwordChange = event => {
    this.setState( { password: event.target.value } );
  }

  handleLogin = (event) => {
   event.preventDefault(); 
	const fd = new FormData();
    fd.append('username', this.state.username);
    fd.append('password', this.state.password);
    fetch( this.props.DATA_URI + '/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      credentials : "same-origin",
      body: fd
    })
    .then((response) => response.json())
    .then((data) => {
      this.props.user.setUser(data.username, data.userId, data.sessioncode);
      cookie.save("sessioncode", data.sessioncode, { path: '/', maxAge: 300000 });	  
	//  this.props.refresh();
    })
    .catch((error) => {
      console.log("error ", error);
    });
  }

  render() {
    return(
      <div>
	  { this.props.user.userId ?  <WelcomeUser username={this.props.user.username} /> : <LoginForm uHandler={this.handleUnameChange} pHandler={this.handlePwordChange} lHandler={this.handleLogin} switchForm={this.props.switchForm} /> }
	  </div>
	  );
  }
}
   
const LoginForm = ({ uHandler, pHandler, lHandler, switchForm }) => {
 
  return(
   <span className="Small-form">
      <form onSubmit={lHandler} styles="display: inline;" >
      Username: <input type="text" onChange={uHandler}/>
      Password: <input type="text" onChange={pHandler}/>
      <input type="submit" value="log in" />
      </form>
    <button onClick={(show) => switchForm('register')}  styles="display: inline" className="Text-button"><font size="1">Need to register?</font></button>
    </span>
    );
};

const WelcomeUser = ({ username }) => {
	return(
	<div>
	Welcome { username }
	</div>
	);
};

export default Login
