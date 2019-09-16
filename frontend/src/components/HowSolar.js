import React, { Component } from "react";

class HowSolar extends Component {
  
  constructor() {
    super();
    this.state = {
      page : "PVvsHeat"
    }
  }

  page = (target) => {
    this.setState( { page : target } );
  }

  render() {

    return (
      <div>
      <button onClick={() => this.page("PVvsHeat")}>Solar photovoltaics vs. Solar heating</button>
      <button onClick={() => this.page("GvHvO")}>Grid tied vs. hybrid vs. off-grid</button>
      <button onClick={() => this.page("MvS")}>Microinverter vs. String inverters vs. Power Optimizers</button>
        <p>There are a few basic categories about types of solar systems and there is sometimes confusion around these issues leading to expectations that don't match what people get.</p>
      {this.state.page === "PVvsHeat" ? <div><h4>Solar photovoltaics vs. Solar heating</h4>
        <p>We install solar photovoltaics.  These are systems which generate electrical power and energy.  There are various types of solar heating which heat water for your home hot water or for pools or even for heating your home.  Photovoltaics supply electrical energy and that energy can be used through electric appliances to do lots of things, including provide heat, but solar photovoltaic systems just connect directly to your electrical system and provide power the same as your electric utility.  Anything you do with that energy (lights, refrigerator, AC, etc) is all separate and will function exactly the same as without solar connected.</p>
        </div> : null }
      {this.state.page === "GvHvO" ? <div> <h4>Grid-tied vs. hybrid vs. off-grid</h4>
        <p>The vast majority of solar systems installed on residential properties are simple grid-tied systems.  Grid tied systems provide energy whenever the sun is shining.  They produce as much power as they available sunlight allows.  When your solar system is generating more power than your home is using your power flows towards the utility where you will either be selling it back to them, or more commonly under net-metering agreements get credited for that energy. Grid-tied systems are the least expensive systems and in most cases provide an excellent financial return on the investment.  It is important to know that purely grid tied systems do not provide any power to your homoe in the event of a utility power outage. The benefits of grid-tied systems are economic and environmental, but not for back-up power.</p>
        <span className="HLWrapper">
        <span className="HLBorder"> </span>
        <span className="Highlight"><p className="Highlight">A note about "power" vs. "energy".  Power is an instantaneous measurement.  Watts or kilowatts (1000 watts) are a measure of power.  Energy is power times time.  Watt-hours or kilowatt-hours (kwh) are units of energy and are what your electric utility measures and bills you by.</p>
          </span>
          <span className="HLBorder"> </span>
          </span>
        <p>Hybrid systems have energy storage, which generally means batteries.  Baterries can be either lead based or lithium.  A hybrid system can function just like a grid-tied system when the utility power is connected, but it can also provide power during a utility outage.  Some people will have a small back up battery array meant to back up minimal usage and perhaps for a relatively short outage.  Some people have larger battery arrays meant to back up the whole house use for extended outages. It all depends on your needs, what you want and your budget.  Off-grid systems are systems where you are completely disconnected from the electric utility and produce and store all of your energy.</p>
          </div> : null }
      {this.state.page === "MvS" || this.state.page === "Micro" || this.state.page === "String" || this.state.page === "PO" ? <div>
          <p>Solar panels generate DC or Direct Current like a battery.  It is current that goes in one direction in an electrical circuit.  Your house on the other hand, uses AC or Alternating Current, which alternates directions in an electrical circuit.  An inverter is an electrical device which converts the DC into AC. There are a few different technologies which are used to accomplish this.</p>
          <button onClick={() => this.page("Micro")}>Micro-inverters</button> vs. <button onClick={() => this.page("String")}>String-inverters</button> vs. <button onClick={() => this.page("PO")}>Power Optimizers</button></div> : null }
      {this.state.page === "Micro" ? <div><h4>Microinverters</h4>
          <p>Solar panels produce direct current (DC).  Inverters convert the DC to Alternating Current (AC) to match the utility power and supply the electricity you need for your appliances.  In microinverter systems every solar panel is paired with a small individual inverter.  The advantages of a microinverter system are that each solar panel can face a different direction, have different shading, and you can monitor the performance of each solar panel.  Microinverter systems are generally slightly more expensive than string inverter systems.</p>
          </div> : null }
      {this.state.page === "String" ? <div><h4>String Inverters</h4>
          <p>In a string or central inverter system the solar panels, generally mounted on your roof, are wired in one or more strings.  Strings generally contain from about 5 to about 15 solar panels.  A system will generally have between one and three strings.  Within each string, all the solar panels should generally face the same direction and have similar shading.  That's because the whole string will only function as well as the lowest performing solar panel.  String inverters generally have between one and three Maximum Power Point Trackers (MPPTs).  Each string with it's own MPPT can face different directions or have different shading without affecting strings connected to other MPPTs.</p>
          <p>The strings on the roof produce DC voltage.   The inverter, generally mounted on either an inside or outside wall near your main service panel (where the breakers are), converts the DC current from the solar panels into AC current that the utility supplies and that you use in the circuits in your home.</p>
          <p>String inverter systems are generally slightly less expensive than either microinverter systems or system with power optimizers.</p>
          </div> : null }
      {this.state.page === "PO" ? <div><h4>Power Optimizers</h4>
          <p>With Power Optimizers or Power Conditioners there is a string inverter, but there is also an electrical device connected to each of the solar panels.  The device optimizes the power supplied from each solar panel so that it functions much like a micro-inverter system in that each panel can face a different direction or have different shading and the panels getting shade or facing away from the sun don't adversely affect the panels which are able to generate more power.  The current sent from the solar panels to the inverter is still Direct Current (DC) and the inverter converts that to Alternating Current to match the utility power and the circuits in your home.  This system also, like micro-inverters, allows you to monitor the performance of each solar panel.  A power optimizer system generally costs more than a string inverter system, but less than a micro-inverter system.</p>
          </div> : null }
      </div>
    );
  }
}

export default HowSolar;
