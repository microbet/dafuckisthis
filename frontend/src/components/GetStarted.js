import React, { Component } from "react";

// so on a new registration and then entering personal info it didn't display the personal info
// sometimes state is too long - just supposed to be 2 chars, probably a typo
// no, sometimes it is undefined ? maybe when you don't change it to anything?  Need a default?
// do I want to be on my projects page on a new registration or just login?
// can't recreate it now
//
// so, the first time I try logging in after a reload it redirects, but after logging out it
// doesn't
//
// am I going to allow for a user to have more than one property?
//
// you shouldn't be able to schedule a site visit before I get the personal info
// when I first enter property it doesn't appear

class GetStarted extends Component {

  constructor(props) {
    super(props);
    this.state = {
      step : this.props.user.step,
      streetAddress : this.props.user.street_address,
      city : this.props.user.city,
      thestate : this.props.user.thestate,
      zip : this.props.user.zip,
      phone : this.props.user.phone,
      email : this.props.user.email,
      property_id : this.props.user.property_id,
      SVDate : this.props.user.SVDate,
      janKWH : this.props.user.janKWH,
      febKWH : this.props.user.febKWH,
      marKWH : this.props.user.marKWH,
      aprKWH : this.props.user.aprKWH,
      mayKWH : this.props.user.mayKWH,
      junKWH : this.props.user.junKWH,
      julKWH : this.props.user.julKWH,
      augKWH : this.props.user.augKWH,
      sepKWH : this.props.user.sepKWH,
      octKWH : this.props.user.octKWH,
      novKWH : this.props.user.novKWH,
      decKWH : this.props.user.decKWH,
    }
    if (this.state.janKWH) {  // probably have to change this - get total kwh
      this.state.totalKWH = this.state.janKWH + this.state.febKWH + this.state.marKWH + this.state.aprKWH + this.state.mayKWH + this.state.junKWH + this.state.julKWH + this.state.augKWH + this.state.sepKWH + this.state.octKWH + this.state.novKWH + this.state.decKWH;
    }
  }

  componentWillReceiveProps(user) {
    this.setState({ streetAddress : this.props.user.street_address });
    this.setState({ city : this.props.user.city });
    this.setState({ thestate : this.props.user.thestate });
    this.setState({ zip: this.props.user.zip });
    this.setState({ phone : this.props.user.phone });
    this.setState({ email : this.props.user.email });
    this.setState({ SVDate : this.props.user.SVDate });
    this.setState({ janKWH : this.props.user.janKWH });
    this.setState({ febKWH : this.props.user.febKWH });
    this.setState({ marKWH : this.props.user.marKWH });
    this.setState({ aprKWH : this.props.user.aprKWH });
    this.setState({ mayKWH : this.props.user.mayKWH });
    this.setState({ junKWH : this.props.user.junKWH });
    this.setState({ julKWH : this.props.user.julKWH });
    this.setState({ augKWH : this.props.user.augKWH });
    this.setState({ sepKWH : this.props.user.sepKWH });
    this.setState({ octKWH : this.props.user.octKWH });
    this.setState({ novKWH : this.props.user.novKWH });
    this.setState({ decKWH : this.props.user.decKWH });
    if (this.props.user.janKWH) {  // probably have to change this - test if some months have no entry - get total kwh
      let totalKWH = this.props.user.janKWH + this.props.user.febKWH + this.props.user.marKWH + this.props.user.aprKWH + this.props.user.mayKWH + this.props.user.junKWH + this.props.user.julKWH + this.props.user.augKWH + this.props.user.sepKWH + this.props.user.octKWH + this.props.user.novKWH + this.props.user.decKWH;
      this.setState({ totalKWH : totalKWH });
    }
  }

  step = (target) => {
    this.setState( { step : target } );
  }

  handleForm = (event) => {
    event.preventDefault(); 
    const fd = new FormData();
    console.log("tspid is ", this.props.user.property_id);
    console.log("tsp is ", this.state.property_id);
    if (this.props.user.property_id) {
      console.log("heyo");
      fd.append('editing', '1');
      fd.append('property_id', this.props.user.property_id);
    }
    else {
      fd.append('editing', 0);
      fd.append('property_id', 0);
    }
    fd.append('streetAddress', this.state.streetAddress);
    fd.append('city', this.state.city);
    fd.append('thestate', this.state.thestate);
    fd.append('zip', this.state.zip);
    fd.append('phone', this.state.phone);
    fd.append('email', this.state.email);
    fd.append('user_id', this.props.user.userId);
    fd.append('section', this.state.step);
    fetch( this.props.DATA_URI + '/basic_info', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      credentials : "same-origin",
      body: fd
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("data is ", data);
      this.setState( { property_id: data.property_id } );
      this.setState( { step : '' });
      this.props.refresh('GetStarted');
    })
    .catch((error) => {
      console.log("error ", error);
    });
  }
  
  handleEnergyForm = (event) => {
    event.preventDefault(); 
    const fd = new FormData();
    if (this.state.step === 'energyedit') {
      fd.append('editing', 1);
    } else {
      fd.append('editing', 0);
    }
    fd.append('jan', this.state.janKWH);
    fd.append('feb', this.state.febKWH);
    fd.append('mar', this.state.marKWH);
    fd.append('apr', this.state.aprKWH);
    fd.append('may', this.state.mayKWH);
    fd.append('jun', this.state.junKWH);
    fd.append('jul', this.state.julKWH);
    fd.append('aug', this.state.augKWH);
    fd.append('sep', this.state.sepKWH);
    fd.append('oct', this.state.octKWH);
    fd.append('nov', this.state.novKWH);
    fd.append('dec', this.state.decKWH);
    fd.append('property_id', this.state.property_id);
    fetch( this.props.DATA_URI + '/energy', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      credentials : "same-origin",
      body: fd
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("data is ", data);
      this.setState( { step : 3 } );
    })
    .catch((error) => {
      console.log("error ", error);
    });
  }

  handleScheduleForm = (event) => {
    event.preventDefault();
    const fd = new FormData();
    if (this.state.step === 'sitevisitedit') {
      fd.append('editing', 1);
    } else {
      fd.append('editing', 0);
    }
    fd.append('note', this.state.note);
    fd.append('property_id', this.state.property_id);
    fd.append('user_id', this.props.user.userId);
    fd.append('type', 'site visit appointment request');
    console.log("Property id is ", this.state.property_id);
    // this might come from edit and not be a site visit appointment request
    // should also trigger an email
    fetch( this.props.DATA_URI + '/appointment', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      credentials : "same-origin",
      body: fd
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("data is ", data);
      this.setState( { step : 4 } );
    })
    .catch((error) => {
      console.log("error ", error);
    });
  }

  handleStreetAddressChange = event => {
    this.setState( { streetAddress: event.target.value } );
    this.props.user.setUserParam('street_address', event.target.value);
  }
  // why is street_address not streetAddress in user?

  handleCityChange = event => {
    this.setState( { city: event.target.value } );
    this.props.user.setUserParam('city', event.target.value);
    // this seemed to fix it for city, probably still broken for other fields
    }

  handleState = event => {
    this.setState( { thestate: event.target.value } );
    this.props.user.setUserParam('thestate', event.target.value);
  }

  handleZip = event => {
    this.setState( { zip: event.target.value } );
    this.props.user.setUserParam('zip', event.target.value);
  }

  handlePhone = event => {
    this.setState( { phone: event.target.value } );
    this.props.user.setUserParam('phone', event.target.value);
  }

  handleEmail = event => {
    this.setState( { email: event.target.value } );
    this.props.user.setUserParam('email', event.target.value);
  }

  handleJan = event => {
    this.setState( { janKWH: event.target.value } );
    this.props.user.setUserParam('janKWH', event.target.value);
  }

  handleFeb = event => {
    this.setState( { febKWH: event.target.value } );
    this.props.user.setUserParam('febKWH', event.target.value);
  }

  handleMar = event => {
    this.setState( { marKWH: event.target.value } );
    this.props.user.setUserParam('marKWH', event.target.value);
  }

  handleApr = event => {
    this.setState( { aprKWH: event.target.value } );
    this.props.user.setUserParam('aprKWH', event.target.value);
  }

  handleMay = event => {
    this.setState( { mayKWH: event.target.value } );
    this.props.user.setUserParam('mayKWH', event.target.value);
  }

  handleJun = event => {
    this.setState( { junKWH: event.target.value } );
    this.props.user.setUserParam('junKWH', event.target.value);
  }

  handleJul = event => {
    this.setState( { julKWH: event.target.value } );
    this.props.user.setUserParam('julKWH', event.target.value);
  }

  handleAug = event => {
    this.setState( { augKWH: event.target.value } );
    this.props.user.setUserParam('augKWH', event.target.value);
  }

  handleSep = event => {
    this.setState( { sepKWH: event.target.value } );
    this.props.user.setUserParam('sepKWH', event.target.value);
  }

  handleOct = event => {
    this.setState( { octKWH: event.target.value } );
    this.props.user.setUserParam('octKWH', event.target.value);
  }

  handleNov = event => {
    this.setState( { novKWH: event.target.value } );
    this.props.user.setUserParam('novKWH', event.target.value);
  }

  handleDec = event => {   
    this.setState( { decKWH: event.target.value } );
    this.props.user.setUserParam('decKWH', event.target.value);
  }

  handleNote = event => {   
    this.setState( { note: event.target.value } );
    console.log("note is ", event.target.value );
  }

  render() {
    // this all looked nicer when I included the forms like functions
    // with jsx, but I couldn't overcome a non-fatal error of turning
    // uncontrolled form elements into controlled elements with that method
    // ok, what happens if I enter after address with or without changing data when logged in
    console.log("step really is ", this.state.step);
    console.log("userid is ", this.props.user.userId);
    console.log("tssvdate = ", this.state.SVDate);
    console.log("tpupid = ", this.props.user.property_id);
    return(
      <div>
        <p>Up here it should show the events which can happen and indicate whether or not they have</p>
        { this.state.property_id ?
          <span>
            <p>My Project</p>
            <span>
            { this.state.phone } { this.state.email } <br />
            { this.state.streetAddress } { this.state.city }, { this.state.thestate } { this.state.zip } <button onClick={() => this.step('address')}>Edit Personal Info</button><br /><br />
            </span>
          </span>
        : null }
        { this.state.janKWH ?
          <span>
          Energy Production<br />
          Jan { this.state.janKWH } kwh<br />
          Feb { this.state.febKWH } kwh<br />
          Mar { this.state.marKWH } kwh<br />
          Apr { this.state.aprKWH } kwh<br />
          May { this.state.mayKWH } kwh<br />
          Jun { this.state.junKWH } kwh<br />
          Jul { this.state.julKWH } kwh<br />
          Aug { this.state.augKWH } kwh<br />
          Sep { this.state.sepKWH } kwh<br />
          Oct { this.state.octKWH } kwh<br />
          Nov { this.state.novKWH } kwh<br />
          Dec { this.state.decKWH } kwh<br />
          total energy = { this.state.totalKWH } kwh <button onClick={() => this.step('energyedit')}>Edit Energy Consumption</button><br />
          </span>
        : 
            <EnergyButton userId={this.props.user.userId} />
        }
       { this.props.user.SVDate ?
          <span>
            Site Visit Ordered: { this.props.user.SVDate } <button onClick={() => this.step('sitevisitedit')}>Edit Site Visit Date</button><br />
          </span>
        : null }
        { !this.props.user.property_id && this.props.user.userId ? 
            <span><button onClick={() => this.step('address')}>Enter Personal Info</button><br /><br /></span>
        : null }
        { this.state.step === 'address' ?
            <PropertyForm propertyHandler={this.handleForm} streetAddressHandler={this.handleStreetAddressChange} streetAddress={this.state.streetAddress} cityChangeHandler={this.handleCityChange} city={this.state.city} stateHandler={this.handleState} thestate={this.state.thestate} zipHandler={this.handleZip} zip={this.state.zip} phoneHandler={this.handlePhone} phone={this.state.phone} emailHandler={this.handleEmail} email={this.state.email}/>
         : null }
      { this.state.step === 'energyedit' || this.state.step === 'energy' ? <EnergyUseForm janHandler={this.handleJan} febHandler={this.handleFeb} marHandler={this.handleMar} aprHandler={this.handleApr} mayHandler={this.handleMay} junHandler={this.handleJun} julHandler={this.handleJul} augHandler={this.handleAug} sepHandler={this.handleSep} octHandler={this.handleOct} novHandler={this.handleNov} decHandler={this.handleDec} energyFormHandler={this.handleEnergyForm} janKWH={this.state.janKWH} febKWH={this.state.febKWH} marKWH={this.state.marKWH} aprKWH={this.state.aprKWH} mayKWH={this.state.mayKWH} junKWH={this.state.junKWH} julKWH={this.state.julKWH} augKWH={this.state.augKWH} sepKWH={this.state.sepKWH} octKWH={this.state.octKWH} novKWH={this.state.novKWH} decKWH={this.state.decKWH} /> : null }
      { this.state.step === 'sitevisit' || this.state.step === 'sitevisitedit' ? <ScheduleAssessmentForm noteHandler={this.handleNote} scheduleHandler={this.handleScheduleForm}/> : null }
      { this.state.step === 4 ? <AssessmentOrdered/> : null }
      { (this.state.SVDate || !this.props.user.userId) || !this.props.user.property_id ? null : <button onClick={() => this.step('sitevisit')}>Schedule a site visit</button> }
      </div>
    );
  }
}

const EnergyButton = ({userId}) => {
  if (userId) {
    return(
    <span><button onClick={() => this.step('energy')}>Enter Energy Consumption</button><br /></span>
    );
  } else {
    return(
    <span>Please Login or Register</span>
    );
  }
}

const AssessmentOrdered = () => {
  return(
  <span>
    Your request has been received.  Someone will contact you within one business day to schedule an assessment of your home.  Thank you.
  </span>
  );
}

const PropertyForm = ({ propertyHandler, streetAddressHandler, streetAddress, cityChangeHandler, city, stateHandler, thestate, zipHandler, zip, phoneHandler, phone, emailHandler, email }) => {
  return(
    <span className="Small-form">
      <form onSubmit={propertyHandler} styles="display: inline;">
        <span className="Form-row">
          <span className="Form-col-one"><nobr>Street Address:</nobr></span>
          <span className="Form-col-two"><input type="text" onChange={streetAddressHandler} value={streetAddress}/></span>
        </span>
        <span className="Form-row">
          <span className="Form-col-one">City:</span>
          <span className="Form-col-two"><input type="text" onChange={cityChangeHandler} value={city}/></span>
        </span>
        <span className="Form-row">
          <span className="Form-col-one">State:</span>
          <span className="Form-col-two">
            <select onChange={stateHandler} value={thestate}>
	      <option value="AL">Alabama</option><option value="AK">Alaska</option><option value="AZ">Arizona</option><option value="AR">Arkansas</option><option value="CA">California</option><option value="CO">Colorado</option><option value="CT">Connecticut</option><option value="DE">Delaware</option><option value="DC">District Of Columbia</option><option value="FL">Florida</option><option value="GA">Georgia</option><option value="HI">Hawaii</option><option value="ID">Idaho</option><option value="IL">Illinois</option><option value="IN">Indiana</option><option value="IA">Iowa</option><option value="KS">Kansas</option><option value="KY">Kentucky</option><option value="LA">Louisiana</option><option value="ME">Maine</option><option value="MD">Maryland</option><option value="MA">Massachusetts</option><option value="MI">Michigan</option><option value="MN">Minnesota</option><option value="MS">Mississippi</option><option value="MO">Missouri</option><option value="MT">Montana</option><option value="NE">Nebraska</option><option value="NV">Nevada</option><option value="NH">New Hampshire</option><option value="NJ">New Jersey</option><option value="NM">New Mexico</option><option value="NY">New York</option><option value="NC">North Carolina</option><option value="ND">North Dakota</option><option value="OH">Ohio</option><option value="OK">Oklahoma</option><option value="OR">Oregon</option><option value="PA">Pennsylvania</option><option value="RI">Rhode Island</option><option value="SC">South Carolina</option><option value="SD">South Dakota</option><option value="TN">Tennessee</option><option value="TX">Texas</option><option value="UT">Utah</option><option value="VT">Vermont</option><option value="VA">Virginia</option><option value="WA">Washington</option><option value="WV">West Virginia</option><option value="WI">Wisconsin</option><option value="WY">Wyoming</option>
            </select>
          </span>
        </span>
        <span className="Form-row">
          <span className="Form-col-one">Zip:</span>
          <span className="Form-col-two"><input type="text" onChange={zipHandler} value={zip}/></span>
        </span>
        <span className="Form-row">
          <span className="Form-col-one">Phone:</span><span className="Form-col-two"><input type="text" onChange={phoneHandler} value={phone}/></span>
        </span>
        <span className="Form-row">
          <span className="Form-col-one">Email:</span><span className="Form-col-two"><input type="text" onChange={emailHandler} value={email}/></span>
        </span>
        <span className="Form-row"><input type="submit" value="enter"/></span>
      </form>
    </span>
  );
};

const ScheduleAssessmentForm = ({ noteHandler, scheduleHandler }) => {
  return(
    <span className="Small-form">
      Would you like to schedule a site assessment?<br/>
      <form onSubmit={scheduleHandler} styles="display: inline;">
      <textarea onChange={noteHandler}></textarea>
      <input type="submit" value="enter"/>
      </form>
    </span>
    );
};

const EnergyUseForm = ({ janHandler, febHandler, marHandler, aprHandler, mayHandler, junHandler, julHandler, augHandler, sepHandler, octHandler, novHandler, decHandler, energyFormHandler, janKWH, febKWH, marKWH, aprKWH, mayKWH, junKWH, julKWH, augKWH, sepKWH, octKWH, novKWH, decKWH }) => {
  return(
    <span className="Small-form">
      Energy use each month<br/>
      <form onSubmit={energyFormHandler} styles="display: inline;">
      January: <input type="text" onChange={janHandler} value={janKWH}/> kwh
      February: <input type="text" onChange={febHandler} value={febKWH}/> kwh
      March: <input type="text" onChange={marHandler} value={marKWH}/> kwh
      April: <input type="text" onChange={aprHandler} value={aprKWH}/> kwh
      May: <input type="text" onChange={mayHandler} value={mayKWH}/> kwh
      June: <input type="text" onChange={junHandler} value={junKWH}/> kwh
      July: <input type="text" onChange={julHandler} value={julKWH}/> kwh
      August: <input type="text" onChange={augHandler} value={augKWH}/> kwh
      September: <input type="text" onChange={sepHandler} value={sepKWH}/> kwh
      October: <input type="text" onChange={octHandler} value={octKWH}/> kwh
      November: <input type="text" onChange={novHandler} value={novKWH}/> kwh
      December: <input type="text" onChange={decHandler} value={decKWH}/> kwh
      <input type="submit" value="enter"/>
      </form>
    </span>
    );
};

export default GetStarted
