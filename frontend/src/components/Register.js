import React, { Component } from 'react';

class Register extends Component {

  constructor(props) {
    super();
    this.state = {
      username: '',
      password: '',
      warning: '',
    }
  }

  handleUnameChange = event => {
    this.setState( { username: event.target.value } );
  }

  handlePwordChange = event => {
    this.setState( { password: event.target.value } );
  }

  handleRegister = () => {

    const fd = new FormData();
    this.props.resetRedirect();
    fd.append('username', this.state.username);
    fd.append('password', this.state.password);
    fetch( this.props.DATA_URI + '/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: fd
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("data = ", data);
      console.log("data userid is ", data.userId);
      if (data.userId === 'Duplicate username') {
        this.setState({ warning: ' That username is already taken.' });
      } else if (data.userId === 'Database error') {
        this.setState({ warning: ' There was a problem registering.  Please try again.' });
      } else {
        this.props.user.setUserParam('username',this.state.username);
        this.props.user.setUserParam('userId', data.userId);
        this.props.user.setUserParam('sessioncode', data.sessioncode);
        this.props.switchForm('login');
      }
    })
    .catch((error) => {
      console.log("error ", error);
    });
  }

  render() {

    return(
      <span className="Small-form">
      <form onSubmit={this.handleRegister}>
      Username: <input type="text" onChange={this.handleUnameChange}/>
      Password: <input type="text" onChange={this.handlePwordChange}/>
      <input type="submit" value="register" />
      </form>
       <button onClick={(show) => this.props.switchForm('login')}  styles="display: inline" className="Text-button"><font size="1">Need to log in?</font></button>
      <span className="warning">{this.state.warning}</span>
      </span>
    );
  }
}

export default Register 
