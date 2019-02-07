import React, { Component } from 'react';

class Leaderboard extends Component {
	
	constructor(props){
		super();
		this.state = {
            mostCommented : '',
			imagePath : '',
                }
	}
	
  componentDidMount() {
	  // get the most commented on picture
      fetch(this.props.DATA_URI + "/get_image?selected_image=most_answers", {
		    method: 'GET',
		    headers: { 'Accept': 'application/json' },
		    credentials: 'same-origin',
	   })
	   .then((response) => response.json())
	   .then((data) => {
		   this.setState( { 
				mostCommented : data.image_id,
				imagePath : data.imagePath 
				} );
		   console.log("most commented on image is ", data.image_id);
	   })
	   .catch((error) => {
		   console.log("error is ", error);
	   });
  }
	  
  render() {
	return(
		<div>
		{this.state.mostCommented}
		<img src={this.props.DATA_URI + this.state.imagePath} alt="what is it img" />
		Here is the leaderboard!
	</div>
	);
    }
}

export default Leaderboard
