import { Component } from 'react';

class User extends Component {

  constructor() {
    super();
    this.userId = 0;
    this.username = '';
  }

  setUser(username, userId, sessionvalue) {
    this.username = username;
    this.userId = userId;
    this.sessionvalue = sessionvalue;
  }

  getUserId = () => {
    return this.userId;
  }
}

export default User

// set the user like sizeup is set
