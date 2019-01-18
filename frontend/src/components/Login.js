import React, { Component } from 'react';
import cookie from 'react-cookies';

class Login extends Component {

  handleUnameChange = event => {
    this.setState( { username: event.target.value } );
  }

  handlePwordChange = event => {
    this.setState( { password: event.target.value } );
  }

  handleLogin = () => {
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
	  this.props.refresh();
    })
    .catch((error) => {
      console.log("error ", error);
    });
  }

  render() {
    return(
      <div>
	  { this.props.user.userId ?  <WelcomeUser username={this.props.user.username} /> : <LoginForm uHandler={this.handleUnameChange} pHandler={this.handlePwordChange} lHandler={this.handleLogin} /> }
	  </div>
	  );
  }
}
   
const LoginForm = ({ uHandler, pHandler, lHandler }) => {
 
  return(
   <div>
   Login<br />
      Username: <input type="text" onChange={uHandler}/>
      Password: <input type="text" onChange={pHandler}/>
      <button onClick={lHandler}>Log in</button>
    </div>
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
