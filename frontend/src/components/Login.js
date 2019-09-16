import React, { Component } from 'react';
import {
  Route,
  NavLink,
  HashRouter,
} from "react-router-dom";
import cookie from 'react-cookies';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin : this.props.user.userId,
      warning : '',
    }
  }

  handleUnameChange = event => {
    this.setState( { username: event.target.value } );
  }

  handlePwordChange = event => {
    this.setState( { password: event.target.value } );
  }

  handleLogin = (event) => {
    this.setState({ warning : "" });
    this.props.resetRedirect();
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
      if (data.userId) {
        this.props.user.setUser(data.username, data.userId, data.sessioncode, data.street_address, data.city, data.thestate, data.zip, data.phone, data.email, data.property_id, data.SVDate, data.janKWH, data.febKWH, data.marKWH, data.aprKWH, data.mayKWH, data.junKWH, data.julKWH, data.augKWH, data.sepKWH, data.octKWH, data.novKWH, data.decKWH);
      cookie.save("sessioncode", data.sessioncode, { path: '/', maxAge: 300000 });	  
        this.setState( { loggedin : data.userId } );
        this.props.refresh('GetStarted');
      } else {
        this.setState({ warning : "There is no record of that username and password.  Please try again or register." });
      }
    })
    .catch((error) => {
      console.log("error ", error);
    });
  }

  callRefresh = (page) => {
    return <HashRouter>{this.props.refresh(page)}</HashRouter>
  }

  handleLogout = () => {
    this.props.user.unsetUser();
    this.setState( { loggedin : 0 } );
    this.props.refresh();
  }

  render() {
    return(
      <div>
	  { this.state.loggedin ?  

            <span className="welcome"><WelcomeUser username={this.props.user.username} /> &nbsp; &nbsp; <HashRouter><span className="Login-link">
            { this.props.refresh('GetStarted') }
            <NavLink onClick={this.handleLogout} exact to="/">Logout</NavLink></span>
              <Route path="/" exact />
            </HashRouter>
            </span> : <LoginForm uHandler={this.handleUnameChange} pHandler={this.handlePwordChange} lHandler={this.handleLogin} switchForm={this.props.switchForm} /> }
          { this.state.warning ? <span>{this.state.warning}</span> : null }
	  </div>
	  );
  }
}

const LoginForm = ({ uHandler, pHandler, lHandler, switchForm }) => {
 
  return(
   <span className="Login-form">
      <form onSubmit={lHandler} styles="display: inline;" >
      Username: <input type="text" onChange={uHandler}/>
      Password: <input type="password" onChange={pHandler}/>
      <input type="submit" value="log in" />
      </form>
    <button onClick={(show) => switchForm('register')}  styles="display: inline" className="Text-button"><font size="1">Need to register?</font></button>
    </span>
    );
};

const WelcomeUser = ({ username }) => {
  return(
    <div>
      <span>
	Welcome { username }
      </span>
    </div>
  );
};

export default Login
