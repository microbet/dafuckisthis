import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './MainPic.css';

class Answers extends Component {
  constructor(props){
    super(props);
	this.state = {
          commentBatch : '',
          oldestAnswerId : 0,
          activeScrollListener : true,
          scrollTimer : true,
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

 //   this.timer = setInterval(() => {
 //       this.props.triggerAnswers();
 //       this.setState( { activeScrollListener : true });
 //     }, 1000);

//  componentWillUpdate() {
//    this.fetchData(1)
//  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  // get the 10 most recent answers- must also know the comment
  // id so you can go back and get the 10 before that
  fetchData(oldestAnswerId) {
 //   this.setState( { localTrigger : 0 } );
    //console.log("update = ", update);
  //  this.props.unTriggerAnswers();
    let retArr = [];
    //console.log("up here oldestaid = ", this.state.oldestAnswerId);
    // fetch( this.props.DATA_URI + "/get_answers?imageId=" + this.props.imageId + "&answerId=" + this.state.oldestAnswerId)
    fetch( this.props.DATA_URI + "/get_answers?imageId=" + this.props.imageId + "&answerId=" + oldestAnswerId)
    // I need to send the answer_id, but in python I can default if 
    // there is none to just getting the most recent
      .then(response => response.json())
      .then(data =>  {
         let thisOldAnswerId = 0;
         data.forEach(function(element) {
           retArr.push([element['answer'], element['answerId']]);
		   // so I think I need to make retArr [[answer, answer_id]... and then sort it by answer_id
		   // then just getting the last member will be the oldest (i think)
           //console.log("hi");
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
           //
           //
           //I'm not going to want this to do 10 at a time 
           //anyway.  I think when I scroll to the bottom
           //i have to start another timer and get one more
           //every second or so that I'm still down there
           //moving the scroll back up will turn off that 
           //timer.
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
         //
         //console.log("toai ", thisOldAnswerId);
        // if (update === 1) { 
        //   console.log("I should get here if it comes from scrolling");
           this.setState({ oldestAnswerId : thisOldAnswerId })
       //    this.props.triggerAnswers();
       //  }
	 //console.log("there");
	 //console.log("there", this.state.oldestAnswerId);
	// this.props.triggerAnswers();
        //console.log(this.state.commentBatch);
	//	 this.props.unTriggerAnswers();
      })
      .then( () => {
        //console.log("hi I am in the future");
      //  this.props.triggerAnswers();
      })
      .catch(error => {
      this.setState({ error, isLoading: false});
        console.log("error: ", error);
      })
      //console.log("up down here oldestaid = ", this.state.oldestAnswerId);
  }
  
  // dunno if this should be a separate function from fetchData or not, maybe combine later
  fetchNextAnswer(answerId, imageId) {
    fetch( this.props.DATA_URI + "/get_next_answer?imageId=" + imageId + "&answerId=" + answerId)
      .then(response => response.json())
      .then(data =>  {
		  //console.log("data returned from fetchNextAnswer is ", data);
		  //console.log("commentBatch is ", this.state.commentBatch)
		  if (data.response != 'oldest') {
			let tempArr = this.state.commentBatch;
			tempArr.push(data[0]['answer']);
			tempArr.shift();
			this.setState( { commentBatch : tempArr } );
			this.setState( { oldestAnswerId : data[0]['answerId'] } );
                        console.log(data[0]['answerId']);
                        console.log(imageId);
                        if (this.state.scrollTimer) {
                          this.timer = setInterval(() => {
                         //  this.fetchNextAnswer(data[0]['answerId'], imageId);
                           this.handleScroll();
                          }, 1000);
                          this.setState( { scrollTimer : false } );
                        }
		  }
	  })
	  .catch(error => {
      this.setState({ error, isLoading: false});
        console.log("error: ", error);
      })
  }

  handleScroll = (event) => {
     if (ReactDOM.findDOMNode(this).scrollHeight - ReactDOM.findDOMNode(this).offsetHeight - 1 < ReactDOM.findDOMNode(this).scrollTop) {
       if (this.state.activeScrollListener) {
		this.fetchNextAnswer(this.state.oldestAnswerId, this.props.imageId);
       }
     }
       if (ReactDOM.findDOMNode(this).scrollHeight - ReactDOM.findDOMNode(this).offsetHeight - 10 < ReactDOM.findDOMNode(this).scrollTop) {
         clearInterval(this.timer);
         this.setState( { scrollTimer : true } );
       }
  }
  
  // and then stop if you scroll away
  // if you have kept it there scrolling down for more than like 5 seconds it should fetch answer
  // like 5 times a second, I definitely need to generalize this behavior for scrolling back up
           // need to impliment scrolling up

  render() {
    let display = [];
    if (Array.isArray(this.state.commentBatch)) {
      if (this.state.commentBatch.length > 0) {
        this.state.commentBatch.map((element, index) => {
         display.push(<ul>{element}</ul>);
        });
      }
    }
        // {(this.props.trigger)}
    return(
          <div className="answerBox">
          {display}
          </div>
	);
    }
}

export default Answers 
