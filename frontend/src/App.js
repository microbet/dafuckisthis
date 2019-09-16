import React, { Component } from 'react';
import './App.css';
import {
  Route,
  NavLink,
  HashRouter,
  Redirect,
} from "react-router-dom";
import Home from "./Home";
import About from "./components/About";
import HowSolar from "./components/HowSolar";
import HowHelpYourself from "./components/HowHelpYourself";
import GetStarted from "./components/GetStarted";
import Login from './components/Login';
import Register from './components/Register';
import User from './User';

var DATA_URI = '';
if (window.location.host === 'localhost:3000') {
  DATA_URI = 'http://127.0.0.1:5000';
}

if (window.location.host === 'www.helpyourselfsolar.com') {
  DATA_URI = 'http://173.255.247.69:5000';
}

class App extends Component {
  constructor(props) {
    super(props);
    var user = new User();
    this.state = {
      user : user,
      loading : 'true',
      showLogin : true,
      getStarted : 1,
      redirect : true,
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

  resetRedirect = () => {
    this.setState({ redirect : true });
  }

  refresh = (page) => {
    console.log("page really is ", page);
    console.log("redirect really is", this.state.redirect);
    if (page === 'GetStarted' && this.state.redirect) {
      this.setState({ redirect : false });
      console.log("hidy");
      return <Redirect to="/components/GetStarted" />
    }
  }

  render() {

    return (
      <div className="wrapper">
        <div>
      { this.state.showLogin ? <Login DATA_URI={DATA_URI} user={this.state.user} switchForm={this.switchForm} refresh={this.refresh} resetRedirect={this.resetRedirect} /> 
        :
        <Register DATA_URI={DATA_URI} switchForm={this.switchForm} user={this.state.user} resetRedirect={this.resetRedirect} /> }
        </div>
        <div className="Core-window1">
          <HashRouter>
          <div className="Core-window2">
            <div className="parent">
              <span>
     <br />
      <br />
      <NavLink exact to="/">Home</NavLink></span>
              <br />
              <span><NavLink to="/components/About">About HelpYourselfSolar.  What makes us special.</NavLink></span>
              <br />
              <span><NavLink to="/components/GetStarted">{ this.state.user.userId ? <span>My Project</span> : <span>Get Started</span> }</NavLink></span>
              <br />
              <span><NavLink to="/components/HowHelpyourself">About How HelpYourselfSolar Works?</NavLink></span>
              <br />
              <span><NavLink to="/components/HowSolar">About How Solar Works?</NavLink></span>
            </div>
            <div className="content">
              <Route path="/" exact component={Home}/>
              <Route path="/components/About" component={About}/>
              <Route path="/components/GetStarted" render={(props) => <GetStarted {...props} DATA_URI={DATA_URI} user={this.state.user} getStarted={this.state.getStarted} refresh={this.refresh} />} />
              <Route path="/components/HowSolar" component={HowSolar}/>
              <Route path="/components/HowHelpyourself" component={HowHelpYourself}/>
            </div>
          </div>
          </HashRouter>
        </div>
      </div>
    );
  }
}

export default App;
