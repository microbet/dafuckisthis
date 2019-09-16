//import { Component } from 'react';

class User {

  constructor() {
 //   super();
    this.userId = 0;
    this.username = '';
    this.imageId = 0;
  }

  setUser(username, userId, sessionvalue, street_address, city, thestate, zip, phone, email, property_id, SVDate, janKWH, febKWH, marKWH, aprKWH, mayKWH, junKWH, julKWH, augKWH, sepKWH, octKWH, novKWH, decKWH) {
    this.username = username;
    this.userId = userId;
    this.sessionvalue = sessionvalue;
    this.street_address = street_address;
    this.city = city;
    this.thestate = thestate;
    this.zip = zip;
    this.phone = phone;
    this.email = email;
    this.property_id = property_id;
    this.SVDate = SVDate;
    this.janKWH = janKWH;
    this.febKWH = febKWH;
    this.marKWH = marKWH;
    this.aprKWH = aprKWH;
    this.mayKWH = mayKWH;
    this.junKWH = junKWH;
    this.julKWH = julKWH;
    this.augKWH = augKWH;
    this.sepKWH = sepKWH;
    this.octKWH = octKWH;
    this.novKWH = novKWH;
    this.decKWH = decKWH;
  }

  setUserParam(paramName, paramValue) {
    this[paramName] = paramValue;
  }

  unsetUser() {
    this.username = '';
    this.userId = 0;
    this.imageId = 0;
    this.sessionvalue = '';
    this.street_address = '';
    this.city = '';
    this.thestate = '';
    this.zip = '';
    this.phone = '';
    this.email = '';
    this.property_id = '';
    this.SVDate = '';
    this.janKWH = '';
    this.febKWH = '';
    this.marKWH = '';
    this.aprKWH = '';
    this.mayKWH = '';
    this.junKWH = '';
    this.julKWH = '';
    this.augKWH = '';
    this.sepKWH = '';
    this.octKWH = '';
    this.novKWH = '';
    this.decKWH = '';
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
