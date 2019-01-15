import React, { Component } from 'react';

class Register extends Component {

  constructor(props) {
    super();
    this.state = {
      username: '',
      password: '',
    }
  }

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
    })
    .catch((error) => {
      console.log("error ", error);
    });
  }

  render() {

    return(
      <div>
      Register<br />
      Username: <input type="text" onChange={this.handleUnameChange}/>
      Password: <input type="text" onChange={this.handlePwordChange}/>
      <button onClick={this.handleLogin}>Log in</button>
      </div>
    );
  }
}

export default Register 
