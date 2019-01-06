import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './MainPic.css';

class Answers extends Component {
  constructor(props){
    super(props);
	this.state = {
          commentBatch : '',
          localTrigger : this.props.trigger,
          oldestAnswerId : 0,
          activeScrollListener : true,
        }
     //   this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData(0);
 //   this.timer = setInterval(() => {
 //       this.props.triggerAnswers();
 //       this.setState( { activeScrollListener : true });
 //     }, 1000);
    ReactDOM.findDOMNode(this).addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  // get the 10 most recent answers- must also know the comment
  // id so you can go back and get the 10 before that
  fetchData(update) {
 //   this.setState( { localTrigger : 0 } );
    //console.log("update = ", update);
    this.props.unTriggerAnswers();
    let retArr = [];
    let thisOldAnswerId = 0;
    fetch( this.props.DATA_URI + "/get_answers?imageId=" + this.props.imageId + "&answerId=" + this.state.oldestAnswerId)
    // I need to send the answer_id, but in python I can default if 
    // there is none to just getting the most recent
      .then(response => response.json())
      .then(data =>  {
         data.forEach(function(element) {
           retArr.push([element['answer'], element['answerId']]);
		   // so I think I need to make retArr [[answer, answer_id]... and then sort it by answer_id
		   // then just getting the last member will be the oldest (i think)
           console.log("hi");
		   if (thisOldAnswerId == 0) {
              thisOldAnswerId = element['answerId'];
           } else {
             if (element['answerId'] < thisOldAnswerId) {
               thisOldAnswerId = element['answerId'];
             }
           }
           //TODO: If I get one with less than 10 or maybe receive a signal that
		   // it was the last set I need to turn off the listener to scrolling down that can
		   // ask for more - or maybe in python just send the last 10?
		   // yeah that because I don't want to really ever get less than 10 if they are available
		   
		   // when you get to the bottom of scroll it doesn't re-fetch right away
		   
		   
           //when new picture comes after closing modal
           //get new answers
         });
		 retArr = retArr.sort(function(a, b) {
			 return b[1] - a[1];
		 });
		 //console.log("down here retArr is ", retArr);
		 let retAnsArr = [];
		 retArr.forEach(function(element) {
			 retAnsArr.push(element[0]);
		 });
         this.setState( { commentBatch : retAnsArr } )
         if (update === 1) { this.setState({ oldestAnswerId : thisOldAnswerId })}
		 console.log("there");
	//	 this.props.triggerAnswers();
	//	 this.props.unTriggerAnswers();
      })
      .catch(error => {
      this.setState({ error, isLoading: false});
        console.log("error: ", error);
      })
  }

  handleScroll = (event) => {
     if (ReactDOM.findDOMNode(this).scrollHeight - ReactDOM.findDOMNode(this).offsetHeight - 10 < ReactDOM.findDOMNode(this).scrollTop) {
       if (this.state.activeScrollListener) {
        this.fetchData(1);
       }
       this.setState({ activeScrollListener : false });
	   this.props.triggerAnswers();
     }
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
          <div className="answerBox">
          {display}
        {(this.props.trigger) ? this.fetchData(0) : this.props.unTriggerAnswers() }
          </div>
	);
    }
}

export default Answers 
