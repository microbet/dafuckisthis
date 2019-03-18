//import { Component } from 'react';

class User {

  constructor() {
 //   super();
    this.userId = 0;
    this.username = '';
    this.imageId = 0;
  }

  setUser(username, userId, sessionvalue) {
    this.username = username;
    this.userId = userId;
    this.sessionvalue = sessionvalue;
  }

  setImageId(imageId) {
    this.imageId = imageId;
  }

  getUserId = () => {
    return this.userId;
  }

  getImageId = () => {
    return this.imageId;
  }
}

export default User
