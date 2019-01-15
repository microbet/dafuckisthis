import React, { Component } from 'react';

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
      this.props.user.setUser(data.username, data.userId);
      this.props.refresh();

    })
    .catch((error) => {
      console.log("error ", error);
    });
  }

  render() {

    return(
      <div>
      Login<br />
      Username: <input type="text" onChange={this.handleUnameChange}/>
      Password: <input type="text" onChange={this.handlePwordChange}/>
      <button onClick={this.handleLogin}>Log in</button>
      </div>
    );
  }
}

export default Login
