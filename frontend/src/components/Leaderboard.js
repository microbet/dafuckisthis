import React, { Component } from 'react';

class Leaderboard extends Component {
	/*
	constructor(props){
		super(props);
		this.state = {
                       
                }
	}
*/
  componentDidMount() {
	  // get the most commented on picture
	  console.log("what the hecko");
	  const fd = new FormData();
	  fd.append("selected_image", "most_answers");
  fetch(this.props.DATA_URI + "/get_image", {
		  method: 'POST',
		  headers: { 'Accept': 'application/json' },
		  credentials: 'same-origin',
		  body: fd
	   })
	   .then((response) => response.json())
	   .then((data) => {
		   console.log("most commented on image is ", data.image_id);
	   })
	   .catch((error) => {
		   console.log("error is ", error);
	   });
  }
	  
  render() {
	return(
		<div>
		   Here is the leaderboard!
	</div>
	);
    }
}

export default Leaderboard