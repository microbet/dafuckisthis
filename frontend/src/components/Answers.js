import React, { Component } from 'react';

class Answers extends Component {
  constructor(props){
    super(props);
	this.state = {
          commentBatch : '',
          localTrigger : this.props.trigger,
        }
  }

  componentDidMount() {
    this.fetchData();
    this.timer = setInterval(() => {
        this.props.triggerAnswers();
      }, 50000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  // get the 10 most recent answers- must also know the comment
  // id so you can go back and get the 10 before that
  fetchData() {
 //   this.setState( { localTrigger : 0 } );
    this.props.unTriggerAnswers();
    let retArr = [];
    fetch( this.props.DATA_URI + "/get_answers?imageId=" + this.props.imageId)
      .then(response => response.json())
      .then(data =>  {
         data.forEach(function(element) {
           retArr.push(element['answer']);
         });
         this.setState( { 
           commentBatch : retArr,
         })
      })
      .catch(error => {
      this.setState({ error, isLoading: false});
        console.log("error: ", error);
      })
  }


  render() {
    let display = [];
    if (Array.isArray(this.state.commentBatch)) {
      if (this.state.commentBatch.length > 0) {
        this.state.commentBatch.map((element, index) => {
         display.push(<ul>{element}</ul>);
        });
      }
    }
    return(
          <div>
          {display}
        {(this.props.trigger) ? this.fetchData() : this.props.unTriggerAnswers() }
          </div>
	);
    }
}

export default Answers 
