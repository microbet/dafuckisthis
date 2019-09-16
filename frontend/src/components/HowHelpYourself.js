import React, { Component } from "react";

class HowHelpYourself extends Component {

  constructor() {
    super();
    this.state = {
      step : 1
    }
  }

  next = () => {
    this.setState( { step : this.state.step + 1 } );
  }

  prev = () => {
    this.setState( { step : this.state.step - 1 } );
  }

  render() {
    
    return (
      <div>
        <p>Getting solar takes several steps to learn about you, your needs, and your home.  It's not complicated if you take it one step at a time.</p>
      { this.state.step > 1  ? <button onClick={() => this.prev()}>Previous</button> : null }
      { this.state.step < 7  ? <button onClick={() => this.next()}>Next</button> : null }
      There should be an image here of the process that changes on every step where the step described is highlighted.
      { this.state.step === 1 ? <Assessment/> : null }
      { this.state.step === 2 ? <Plans/> : null }
      { this.state.step === 3 ? <Permitting/> : null }
      { this.state.step === 4 ? <Materials/> : null }
      { this.state.step === 5 ? <Installation/> : null }
      { this.state.step === 6 ? <Inspection/> : null }
      { this.state.step === 7 ? <Utility/> : null }
      </div>
    );
  }
}

const Assessment = () => {
  return(
    <span>
    <h3>Site Assessment</h3>
    <p>A proper site assessment is necessary to determine what size and types of systems are possible for your home.  This cannot be done from satellite imagery.  It can be approximated, but in order to avoid having to make changes and change orders in the middle of a project, it should be done at the start.</p>
    <p>HelpYourSelfSolar will connect you with an independent, experienced, solar assessment professional.  The site assessor will examine and measure your roof, your solar potentential, and your electrical system.  They will gather the information necessary for a consultant to size your system and discuss the possibilities with you and for a designer to prepare your plans.</p>
    </span>
  );
}

const Plans = () => {
  return(
    <span>
      <h3>Plans</h3>
      <p>Detailed plans need to be prepared for submittal to what is called the "Authority Having Jurisdiction (AHJ)".  This is usually your city building department.</p>
    </span>
  );
}

const Permitting = () => {
  return(
    <span>
      <h3>Permitting</h3>
      <p>Plans, along with an application, need to be submitted.  Some cities can approve plans over the counter and some take them in for review.  Sometimes there will be corrections and the corrected plans will have to be resubmitted.  Permit and review fees vary considerably.</p>
    </span>
  );
}

const Materials = () => {
  return(
    <span>
      <h3>Materials</h3>
      <p>Solar panels, inverters, and racking equipment are ordered from a solar distributor and then delivered to your house.</p>
    </span>
  );
}

const Installation = () => {
  return(
    <span>
      <h3>Installation</h3>
      <p>The installation crew comes to your home and installs the solar system.  This sometimes takes as little as one day and sometimes as much as a week for a residential installation.  Usually it's two or three days.</p>
    </span>
  );
}

const Inspection = () => {
  return(
    <span>
      <h3>Inspection</h3>
      <p>The solar system is inspected by the AHJ inspector.  Sometimes there will be corrections.</p>
    </span>
  );
}

const Utility = () => {
  return(
    <span>
      <h3>Utility approval</h3>
      <p>There is some paperwork involved and documents which may need to be signed.  After everything is submitted to the utility (generally online), they will review it and either request corrections or additional information or approve the system to be activated.  The sometimes takes as little as a few days.  It often takes a couple weeks.  There were times when this generally took months for some utilities, but barring unusual circumstances, the utilities generally don't take that long.</p>
    </span>
  );
}

export default HowHelpYourself;
